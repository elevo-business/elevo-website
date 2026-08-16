"""CSV-Export — UTF-8 mit BOM, Semikolon als Trenner (Excel-tauglich)."""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

# Reihenfolge aus dem Briefing. 'postanschrift_impressum' und 'handelsregister'
# sind ergaenzt, weil beides laut Briefing extrahiert wird, aber in der
# Spaltenliste keinen Platz hatte. 'score' und 'notiz' bleiben leer und stehen
# bewusst am Ende — die werden von Hand gefuellt.
SPALTEN = [
    "firma",
    "strasse",
    "plz",
    "ort",
    "telefon",
    "website",
    "email",
    "email_typ",
    "ansprechpartner",
    "branche_suchbegriff",
    "bewertungen_anzahl",
    "bewertung",
    "place_id",
    "impressum_url",
    "impressum_status",
    "postanschrift_impressum",
    "handelsregister",
    "abgerufen_am",
    "quelle",
    "score",
    "notiz",
]


def schreiben(zeilen: list[dict[str, Any]], ziel: Path) -> None:
    with ziel.open("w", encoding="utf-8-sig", newline="") as datei:
        writer = csv.DictWriter(
            datei,
            fieldnames=SPALTEN,
            delimiter=";",
            quoting=csv.QUOTE_MINIMAL,
            extrasaction="ignore",
        )
        writer.writeheader()
        for zeile in zeilen:
            writer.writerow({spalte: zeile.get(spalte, "") for spalte in SPALTEN})
