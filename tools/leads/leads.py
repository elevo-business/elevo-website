#!/usr/bin/env python3
"""Lead-Recherche-Tool — CLI.

Das Tool erzeugt ausschliesslich eine Datei (Rohdaten bzw. CSV).
Es verschickt nichts. Eine Versandfunktion gibt es bewusst nicht.

Aufrufe:
    python leads.py probe --suchbegriff "Ingenieurbuero TGA" --stadt "Berlin"
    python leads.py run --config targets.yaml --out leads.csv
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import date
from pathlib import Path

from leadtool import csvout
from leadtool.cache import Cache
from leadtool.config import (
    Blocklist,
    ConfigError,
    load_api_key,
    load_targets,
)
from leadtool.impressum import (
    ImpressumCrawler,
    ImpressumErgebnis,
    domain_von_url,
    email_typ,
)
from leadtool.places import (
    BudgetExceeded,
    CallCounter,
    PlacesClient,
    PlacesError,
    passt_filter,
)

BASIS = Path(__file__).resolve().parent


def cmd_probe(args: argparse.Namespace) -> int:
    """Schritt 2: eine einzelne Query, Rohausgabe als JSON — zum Datencheck."""
    api_key = load_api_key(BASIS / ".env")
    ziele = load_targets(Path(args.config)) if Path(args.config).exists() else None
    blocklist = Blocklist.load(BASIS / "blocklist.txt")

    max_calls = args.max_api_calls or (ziele.limits.max_api_calls if ziele else 10)
    max_seiten = args.max_seiten or (ziele.limits.max_seiten_pro_query if ziele else 3)
    filt = ziele.filter if ziele else None

    counter = CallCounter(limit=max_calls)
    treffer = []
    verworfen: list[dict[str, str]] = []

    print(
        f"Query: '{args.suchbegriff}' in '{args.stadt}' "
        f"(max. {max_seiten} Seiten, Budget {max_calls} Aufrufe)",
        file=sys.stderr,
    )

    try:
        with PlacesClient(api_key, counter) as client:
            for place in client.search_text(args.suchbegriff, args.stadt, max_seiten):
                if blocklist.blockt_domain(place.website):
                    verworfen.append({"firma": place.name, "grund": "blocklist"})
                    continue
                if filt:
                    behalten, grund = passt_filter(
                        place,
                        filt.min_bewertungen,
                        filt.nur_operational,
                        filt.ausschluss_typen,
                    )
                    if not behalten:
                        verworfen.append({"firma": place.name, "grund": grund})
                        continue
                treffer.append(place)
    except BudgetExceeded as fehler:
        print(f"ABBRUCH: {fehler}", file=sys.stderr)
    except PlacesError as fehler:
        print(f"Places-API-Fehler: {fehler}", file=sys.stderr)
        return 1

    ausgabe = {
        "abgerufen_am": date.today().isoformat(),
        "quelle": "Google Places API v1 (places:searchText)",
        "suchbegriff": args.suchbegriff,
        "stadt": args.stadt,
        "api_aufrufe": counter.calls,
        "treffer_anzahl": len(treffer),
        "verworfen_anzahl": len(verworfen),
        "verworfen": verworfen,
        "treffer": [
            {
                "place_id": p.place_id,
                "firma": p.name,
                "strasse": p.strasse,
                "plz": p.plz,
                "ort": p.ort,
                "formatierte_adresse": p.formatted_address,
                "telefon": p.telefon,
                "website": p.website,
                "bewertung": p.rating,
                "bewertungen_anzahl": p.user_rating_count,
                "business_status": p.business_status,
                "types": p.types,
            }
            for p in treffer
        ],
    }

    ziel = Path(args.out_json)
    ziel.write_text(
        json.dumps(ausgabe, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(
        f"{len(treffer)} Treffer, {len(verworfen)} verworfen, "
        f"{counter.calls} API-Aufrufe -> {ziel}",
        file=sys.stderr,
    )
    return 0


def _abweichende_anschrift(impressum_anschrift: str, place) -> str:
    """Nur ausgeben, wenn das Impressum eine andere Anschrift nennt als Google."""
    if not impressum_anschrift:
        return ""
    if place.plz and place.plz in impressum_anschrift:
        return ""
    return impressum_anschrift


def _log(text: str) -> None:
    print(text, file=sys.stderr, flush=True)


def _phase_places(
    ziele, cache: Cache, api_key: str, refresh: bool
) -> tuple[int, bool]:
    """Schritt 1+3: alle Query-Kombinationen abarbeiten und cachen."""
    counter = CallCounter(limit=ziele.limits.max_api_calls)
    budget_erschoepft = False
    kombinationen = ziele.queries

    _log(f"[Places] {len(kombinationen)} Kombinationen, Budget {counter.limit} Aufrufe")

    with PlacesClient(api_key, counter) as client:
        for nr, (suchbegriff, stadt) in enumerate(kombinationen, start=1):
            if not refresh and cache.query_erledigt(suchbegriff, stadt):
                _log(f"  [{nr}/{len(kombinationen)}] '{suchbegriff}' / {stadt}: aus Cache")
                continue

            vorher = counter.calls
            gefunden = 0
            try:
                for place in client.search_text(
                    suchbegriff, stadt, ziele.limits.max_seiten_pro_query
                ):
                    cache.place_speichern(place)
                    gefunden += 1
            except BudgetExceeded as fehler:
                cache.commit()
                _log(f"  ABBRUCH: {fehler}")
                budget_erschoepft = True
                break
            except PlacesError as fehler:
                cache.commit()
                cache.query_abschliessen(suchbegriff, stadt, gefunden, counter.calls - vorher, "fehler")
                _log(f"  [{nr}/{len(kombinationen)}] '{suchbegriff}' / {stadt}: FEHLER {fehler}")
                continue

            cache.commit()
            cache.query_abschliessen(suchbegriff, stadt, gefunden, counter.calls - vorher)
            _log(
                f"  [{nr}/{len(kombinationen)}] '{suchbegriff}' / {stadt}: "
                f"{gefunden} Treffer, {counter.calls - vorher} Aufrufe"
            )

    _log(f"[Places] fertig — {counter.calls} API-Aufrufe verbraucht")
    return counter.calls, budget_erschoepft


def cmd_run(args: argparse.Namespace) -> int:
    ziele = load_targets(Path(args.config))
    blocklist = Blocklist.load(BASIS / "blocklist.txt")
    api_key = load_api_key(BASIS / ".env")
    cache_pfad = Path(args.cache)

    with Cache(cache_pfad) as cache:
        # --- Schritt 1 + 3: Places abfragen, cachen ---------------------
        api_aufrufe, budget_erschoepft = _phase_places(
            ziele, cache, api_key, args.refresh
        )

        # --- Schritt 3: deduplizieren und filtern -----------------------
        alle = cache.alle_places()
        behalten: list[tuple] = []
        verworfen: dict[str, int] = {}
        for place, abgerufen_am in alle:
            if blocklist.blockt_domain(place.website):
                verworfen["blocklist"] = verworfen.get("blocklist", 0) + 1
                continue
            ok, grund = passt_filter(
                place,
                ziele.filter.min_bewertungen,
                ziele.filter.nur_operational,
                ziele.filter.ausschluss_typen,
            )
            if not ok:
                schluessel = grund.split("=")[0]
                verworfen[schluessel] = verworfen.get(schluessel, 0) + 1
                continue
            behalten.append((place, abgerufen_am))

        _log(
            f"[Dedup] {len(alle)} eindeutige Places im Cache, "
            f"{len(behalten)} nach Filter, {sum(verworfen.values())} verworfen "
            f"({', '.join(f'{k}: {v}' for k, v in sorted(verworfen.items())) or 'keine'})"
        )

        # --- Schritt 4: Impressum ---------------------------------------
        impressum_je_domain: dict[str, ImpressumErgebnis] = {}
        if not args.ohne_impressum:
            domains: list[str] = []
            for place, _ in behalten:
                if not place.website:
                    continue
                domain = domain_von_url(place.website)
                if domain and domain not in domains:
                    domains.append(domain)
            if args.max_domains:
                domains = domains[: args.max_domains]

            _log(f"[Impressum] {len(domains)} Domains")
            url_je_domain = {
                domain_von_url(p.website): p.website for p, _ in behalten if p.website
            }

            with ImpressumCrawler(
                ziele.crawl.user_agent,
                ziele.crawl.timeout_sekunden,
                ziele.crawl.max_seiten_pro_domain,
            ) as crawler:
                for nr, domain in enumerate(domains, start=1):
                    gecacht = None if args.refresh else cache.impressum_laden(domain)
                    if gecacht:
                        impressum_je_domain[domain] = ImpressumErgebnis.from_dict(gecacht)
                        continue
                    ergebnis = crawler.auswerten(url_je_domain.get(domain, domain))
                    impressum_je_domain[domain] = ergebnis
                    cache.impressum_speichern(domain, ergebnis.as_dict())
                    if nr % 10 == 0 or nr == len(domains):
                        _log(f"  [{nr}/{len(domains)}] zuletzt: {domain} -> {ergebnis.status}")
                    time.sleep(ziele.crawl.pause_zwischen_domains)

        # --- Schritt 5: CSV ---------------------------------------------
        zeilen = []
        for place, abgerufen_am in behalten:
            domain = domain_von_url(place.website) if place.website else ""
            imp = impressum_je_domain.get(domain, ImpressumErgebnis(status="nicht_abgerufen"))
            emails = [e for e in imp.emails if not blocklist.blockt_email(e)]
            zeilen.append(
                {
                    "firma": place.name,
                    "strasse": place.strasse,
                    "plz": place.plz,
                    "ort": place.ort or place.stadt_query,
                    "telefon": place.telefon or "",
                    "website": place.website or "",
                    "email": "|".join(emails),
                    "email_typ": "|".join(email_typ(e) for e in emails) or "leer",
                    "ansprechpartner": imp.ansprechpartner,
                    "branche_suchbegriff": place.suchbegriff,
                    "bewertungen_anzahl": place.user_rating_count,
                    "bewertung": place.rating if place.rating is not None else "",
                    "place_id": place.place_id,
                    "impressum_url": imp.impressum_url,
                    "impressum_status": imp.status,
                    "postanschrift_impressum": _abweichende_anschrift(imp.postanschrift, place),
                    "handelsregister": imp.handelsregister,
                    "abgerufen_am": abgerufen_am,
                    "quelle": "Google Places API v1 (places:searchText)"
                    + ("; Impressum der Firmen-Website" if imp.status.startswith("ok") else ""),
                    "score": "",
                    "notiz": "",
                }
            )

        ziel = Path(args.out)
        csvout.schreiben(zeilen, ziel)
        stats = cache.statistik()

    mit_email = sum(1 for z in zeilen if z["email"])
    mit_person = sum(1 for z in zeilen if z["ansprechpartner"])
    _log(
        f"[CSV] {len(zeilen)} Zeilen -> {ziel}\n"
        f"      {mit_email} mit E-Mail, {mit_person} mit Ansprechpartner\n"
        f"      Cache: {stats['queries']} Queries, {stats['places']} Places, "
        f"{stats['impressum']} Domains ({cache_pfad})\n"
        f"      API-Aufrufe in diesem Lauf: {api_aufrufe}"
    )
    if budget_erschoepft:
        _log(
            "      HINWEIS: Kostenbremse hat ausgeloest — die Liste ist unvollstaendig. "
            "Limit erhoehen und erneut starten, der Cache wird wiederverwendet."
        )
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="leads.py",
        description="Qualifizierte Firmenliste aus Google Places + Impressum. "
        "Erzeugt nur Dateien, versendet nichts.",
    )
    sub = parser.add_subparsers(dest="befehl", required=True)

    p_probe = sub.add_parser("probe", help="Eine einzelne Query, Rohausgabe als JSON")
    p_probe.add_argument("--suchbegriff", required=True)
    p_probe.add_argument("--stadt", required=True)
    p_probe.add_argument("--config", default=str(BASIS / "targets.yaml"))
    p_probe.add_argument("--out-json", default=str(BASIS / "probe.json"))
    p_probe.add_argument("--max-seiten", type=int, default=None)
    p_probe.add_argument("--max-api-calls", type=int, default=None)
    p_probe.set_defaults(func=cmd_probe)

    p_run = sub.add_parser("run", help="Volllauf ueber die Config")
    p_run.add_argument("--config", default=str(BASIS / "targets.yaml"))
    p_run.add_argument("--out", default=str(BASIS / "leads.csv"))
    p_run.add_argument("--cache", default=str(BASIS / "cache.sqlite"))
    p_run.add_argument(
        "--refresh",
        action="store_true",
        help="Cache ignorieren und alles neu abrufen (kostet erneut API-Aufrufe)",
    )
    p_run.add_argument(
        "--ohne-impressum",
        action="store_true",
        help="Nur Places-Daten, keine Website-Auswertung",
    )
    p_run.add_argument(
        "--max-domains",
        type=int,
        default=None,
        help="Impressum nur fuer die ersten N Domains (zum Testen)",
    )
    p_run.set_defaults(func=cmd_run)

    args = parser.parse_args(argv)
    try:
        return int(args.func(args))
    except ConfigError as fehler:
        print(f"Konfigurationsfehler: {fehler}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
