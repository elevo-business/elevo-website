"""Google Places API v1 — Text Search (places:searchText).

Bewusst nur die neue API, nicht die Legacy-Variante.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Iterator

import httpx
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText"

# Minimal noetige Felder laut Briefing. Jedes Feld kostet Geld (SKU-Stufe),
# deshalb hier nichts ohne Grund ergaenzen.
FIELD_MASK = ",".join(
    [
        "nextPageToken",
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.addressComponents",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.businessStatus",
        "places.rating",
        "places.userRatingCount",
        "places.types",
        "places.location",
    ]
)

PAGE_SIZE = 20  # harte Obergrenze der API


class BudgetExceeded(RuntimeError):
    """Kostenbremse hat ausgeloest — harter Abbruch."""


class PlacesError(RuntimeError):
    """Nicht wiederholbarer Fehler der Places API."""


class RetryableHTTPError(RuntimeError):
    """429 oder 5xx — von tenacity wiederholt."""


@dataclass
class CallCounter:
    """Zaehlt API-Aufrufe und bricht beim Limit hart ab."""

    limit: int
    calls: int = 0

    def check_and_increment(self) -> None:
        if self.calls >= self.limit:
            raise BudgetExceeded(
                f"Kostenbremse: {self.limit} API-Aufrufe erreicht. "
                "Abbruch. Limit in targets.yaml unter 'limits.max_api_calls' anpassen."
            )
        self.calls += 1

    @property
    def rest(self) -> int:
        return max(0, self.limit - self.calls)


@dataclass
class Place:
    """Ein Treffer, bereits auf die verwendeten Felder reduziert."""

    place_id: str
    name: str
    formatted_address: str
    website: str | None
    telefon: str | None
    business_status: str | None
    rating: float | None
    user_rating_count: int
    types: list[str] = field(default_factory=list)
    strasse: str = ""
    plz: str = ""
    ort: str = ""
    suchbegriff: str = ""
    stadt_query: str = ""
    roh: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_api(cls, data: dict[str, Any], suchbegriff: str, stadt: str) -> "Place":
        komponenten = data.get("addressComponents") or []

        def komponente(*typen: str) -> str:
            for k in komponenten:
                if any(t in (k.get("types") or []) for t in typen):
                    return k.get("longText") or k.get("shortText") or ""
            return ""

        route = komponente("route")
        hausnummer = komponente("street_number")
        strasse = " ".join(x for x in (route, hausnummer) if x).strip()

        return cls(
            place_id=data.get("id", ""),
            name=(data.get("displayName") or {}).get("text", ""),
            formatted_address=data.get("formattedAddress", ""),
            website=data.get("websiteUri"),
            telefon=data.get("nationalPhoneNumber"),
            business_status=data.get("businessStatus"),
            rating=data.get("rating"),
            user_rating_count=int(data.get("userRatingCount") or 0),
            types=list(data.get("types") or []),
            strasse=strasse,
            plz=komponente("postal_code"),
            ort=komponente("locality", "postal_town"),
            suchbegriff=suchbegriff,
            stadt_query=stadt,
            roh=data,
        )


class PlacesClient:
    def __init__(self, api_key: str, counter: CallCounter, timeout: float = 20.0) -> None:
        self._api_key = api_key
        self.counter = counter
        self._client = httpx.Client(
            timeout=timeout,
            headers={
                "Content-Type": "application/json",
                "X-Goog-Api-Key": api_key,
                "X-Goog-FieldMask": FIELD_MASK,
            },
        )

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "PlacesClient":
        return self

    def __exit__(self, *_exc: object) -> None:
        self.close()

    @retry(
        retry=retry_if_exception_type((RetryableHTTPError, httpx.TransportError)),
        wait=wait_exponential(multiplier=2, min=2, max=16),
        stop=stop_after_attempt(4),
        reraise=True,
    )
    def _post(self, payload: dict[str, Any]) -> dict[str, Any]:
        antwort = self._client.post(SEARCH_TEXT_URL, json=payload)

        if antwort.status_code == 200:
            return antwort.json()

        if antwort.status_code == 429 or antwort.status_code >= 500:
            raise RetryableHTTPError(
                f"HTTP {antwort.status_code}: {antwort.text[:300]}"
            )

        # 400/403 etc. sind Konfigurationsfehler — Wiederholung waere nur teuer.
        raise PlacesError(f"HTTP {antwort.status_code}: {antwort.text[:500]}")

    def search_text(
        self,
        suchbegriff: str,
        stadt: str,
        max_seiten: int = 3,
    ) -> Iterator[Place]:
        """Eine Query abarbeiten, inkl. Paginierung ueber nextPageToken."""
        text_query = f"{suchbegriff} {stadt}".strip()
        page_token: str | None = None

        for seite in range(max_seiten):
            payload: dict[str, Any] = {
                "textQuery": text_query,
                "languageCode": "de",
                "regionCode": "DE",
                "pageSize": PAGE_SIZE,
            }
            if page_token:
                payload["pageToken"] = page_token

            self.counter.check_and_increment()
            daten = self._post(payload)

            for eintrag in daten.get("places") or []:
                yield Place.from_api(eintrag, suchbegriff, stadt)

            page_token = daten.get("nextPageToken")
            if not page_token:
                return
            # Der Token braucht serverseitig einen Moment, bis er gueltig ist.
            if seite + 1 < max_seiten:
                time.sleep(2.0)


def passt_filter(
    place: Place,
    min_bewertungen: int,
    nur_operational: bool,
    ausschluss_typen: list[str],
) -> tuple[bool, str]:
    """(behalten, grund_falls_verworfen)"""
    if nur_operational and place.business_status not in (None, "OPERATIONAL"):
        return False, f"business_status={place.business_status}"
    if place.user_rating_count < min_bewertungen:
        return False, f"bewertungen={place.user_rating_count}<{min_bewertungen}"
    treffer = set(place.types) & set(ausschluss_typen)
    if treffer:
        return False, f"ausschluss_typ={','.join(sorted(treffer))}"
    return True, ""
