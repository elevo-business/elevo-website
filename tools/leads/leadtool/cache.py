"""Lokaler SQLite-Cache — macht Laeufe idempotent und wiederaufnehmbar.

Ein Abbruch darf keine API-Kosten verbrennen: abgeschlossene Queries und bereits
ausgewertete Domains werden beim naechsten Lauf uebersprungen.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import date
from pathlib import Path
from typing import Any

from .places import Place

SCHEMA = """
CREATE TABLE IF NOT EXISTS queries (
    suchbegriff  TEXT NOT NULL,
    stadt        TEXT NOT NULL,
    status       TEXT NOT NULL,
    treffer      INTEGER NOT NULL DEFAULT 0,
    api_aufrufe  INTEGER NOT NULL DEFAULT 0,
    abgerufen_am TEXT NOT NULL,
    PRIMARY KEY (suchbegriff, stadt)
);
CREATE TABLE IF NOT EXISTS places (
    place_id      TEXT PRIMARY KEY,
    daten         TEXT NOT NULL,
    erst_suchbegriff TEXT NOT NULL,
    erst_stadt    TEXT NOT NULL,
    abgerufen_am  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS query_places (
    suchbegriff TEXT NOT NULL,
    stadt       TEXT NOT NULL,
    place_id    TEXT NOT NULL,
    PRIMARY KEY (suchbegriff, stadt, place_id)
);
CREATE TABLE IF NOT EXISTS impressum (
    domain       TEXT PRIMARY KEY,
    daten        TEXT NOT NULL,
    abgerufen_am TEXT NOT NULL
);
"""


class Cache:
    def __init__(self, pfad: Path) -> None:
        self.pfad = pfad
        self.con = sqlite3.connect(pfad)
        self.con.row_factory = sqlite3.Row
        self.con.executescript(SCHEMA)
        self.con.commit()

    def close(self) -> None:
        self.con.commit()
        self.con.close()

    def __enter__(self) -> "Cache":
        return self

    def __exit__(self, *_exc: object) -> None:
        self.close()

    # -- Queries ---------------------------------------------------------

    def query_erledigt(self, suchbegriff: str, stadt: str) -> bool:
        zeile = self.con.execute(
            "SELECT status FROM queries WHERE suchbegriff = ? AND stadt = ?",
            (suchbegriff, stadt),
        ).fetchone()
        return bool(zeile) and zeile["status"] == "ok"

    def query_abschliessen(
        self, suchbegriff: str, stadt: str, treffer: int, api_aufrufe: int, status: str = "ok"
    ) -> None:
        self.con.execute(
            "INSERT OR REPLACE INTO queries "
            "(suchbegriff, stadt, status, treffer, api_aufrufe, abgerufen_am) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (suchbegriff, stadt, status, treffer, api_aufrufe, date.today().isoformat()),
        )
        self.con.commit()

    # -- Places ----------------------------------------------------------

    def place_speichern(self, place: Place) -> None:
        self.con.execute(
            "INSERT OR IGNORE INTO places "
            "(place_id, daten, erst_suchbegriff, erst_stadt, abgerufen_am) "
            "VALUES (?, ?, ?, ?, ?)",
            (
                place.place_id,
                json.dumps(place.roh, ensure_ascii=False),
                place.suchbegriff,
                place.stadt_query,
                date.today().isoformat(),
            ),
        )
        self.con.execute(
            "INSERT OR IGNORE INTO query_places (suchbegriff, stadt, place_id) "
            "VALUES (?, ?, ?)",
            (place.suchbegriff, place.stadt_query, place.place_id),
        )

    def commit(self) -> None:
        self.con.commit()

    def alle_places(self) -> list[tuple[Place, str]]:
        """Alle gecachten Places, dedupliziert ueber die Place-ID.

        Zweiter Wert ist das Abrufdatum aus dem Cache.
        """
        zeilen = self.con.execute(
            "SELECT place_id, daten, erst_suchbegriff, erst_stadt, abgerufen_am "
            "FROM places ORDER BY erst_suchbegriff, erst_stadt, place_id"
        ).fetchall()
        ergebnis = []
        for z in zeilen:
            daten = json.loads(z["daten"])
            ergebnis.append(
                (
                    Place.from_api(daten, z["erst_suchbegriff"], z["erst_stadt"]),
                    z["abgerufen_am"],
                )
            )
        return ergebnis

    # -- Impressum -------------------------------------------------------

    def impressum_laden(self, domain: str) -> dict[str, Any] | None:
        zeile = self.con.execute(
            "SELECT daten FROM impressum WHERE domain = ?", (domain,)
        ).fetchone()
        return json.loads(zeile["daten"]) if zeile else None

    def impressum_speichern(self, domain: str, daten: dict[str, Any]) -> None:
        self.con.execute(
            "INSERT OR REPLACE INTO impressum (domain, daten, abgerufen_am) "
            "VALUES (?, ?, ?)",
            (domain, json.dumps(daten, ensure_ascii=False), date.today().isoformat()),
        )
        self.con.commit()

    def statistik(self) -> dict[str, int]:
        def zahl(sql: str) -> int:
            return int(self.con.execute(sql).fetchone()[0])

        return {
            "queries": zahl("SELECT COUNT(*) FROM queries WHERE status = 'ok'"),
            "places": zahl("SELECT COUNT(*) FROM places"),
            "impressum": zahl("SELECT COUNT(*) FROM impressum"),
        }
