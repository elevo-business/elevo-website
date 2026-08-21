#!/usr/bin/env python3
"""Erzeugt aus leads.csv eine Tracking-Liste als CSV fuer Google Sheets.

Filtert auf einen Ort und auf inhabergefuehrte Betriebe. Konzerne, Filialen und
Ketten fliegen raus — erkannt an vier Signalen, nicht an einer Namensliste
allein:

1. Rechtsform AG/SE/KGaA oder ein bekannter Konzernname
2. dieselbe Domain an mehreren Standorten (Kette)
3. Impressumsanschrift ausserhalb des Zielorts (Zentrale sitzt woanders)
4. kein Inhaber oder Geschaeftsfuehrer im Impressum genannt

    python export_sheets.py --ort Berlin --out berlin.csv
"""

from __future__ import annotations

import argparse
import csv
import re
from collections import Counter
from pathlib import Path

KONZERN = re.compile(
    r"\b(Bechtle|Randstad|Adecco|Hays|Amadeus Fire|Robert Half|DIS AG|Orizon|"
    r"Tempton|TIMEPARTNER|Manpower|Persona|Piening|Ferchau|Brunel|GULP|Unique|"
    r"avanti|pluss|Bankpower|Permacon|Jobactive|Majori|Promedis|Austin Fraser|"
    r"Trenkwalder|Hofmann|Axians|Medialine|Sthree|Zeitkraft|Runtime)\b",
    re.IGNORECASE,
)
GROSSFORM = re.compile(r"\b(AG|SE|KGaA)\b")
FILIALE = re.compile(r"\b(Niederlassung|Filiale)\b", re.IGNORECASE)
BERLIN_PLZ = re.compile(r"1[0-3]\d{3}|14[01]\d{2}")

SPALTEN = [
    "Nr", "Firma", "Ansprechpartner", "E-Mail", "Variante", "Mail 1 am",
    "Mail 2 am", "Mail 3 am", "Antwort am", "Antwortart", "Nächstes Follow-up",
    "Status heute", "Anschrift", "Telefon", "Website", "Branche",
    "Google-Bewertung", "Notiz",
]

FORMEL_FOLLOWUP = (
    '=IF(F{z}="","",IF(I{z}<>"","beantwortet",'
    'IF(G{z}="",F{z}+5,IF(H{z}="",F{z}+12,"Sequenz beendet"))))'
)
FORMEL_STATUS = (
    '=IF(K{z}="","",IF(ISNUMBER(K{z}),'
    'IF(K{z}<=TODAY(),"FÄLLIG","in "&(K{z}-TODAY())&" Tagen"),K{z}))'
)


def primaeradresse(zeile: dict[str, str]) -> str:
    paare = list(zip(zeile["email"].split("|"), zeile["email_typ"].split("|")))
    for adresse, typ in paare:
        if typ == "funktion":
            return adresse
    return paare[0][0]


def domain(zeile: dict[str, str]) -> str:
    if not zeile["website"]:
        return ""
    return re.sub(r"^https?://(www\.)?", "", zeile["website"]).split("/")[0].lower()


def im_zielort(anschrift: str, plz_muster: re.Pattern) -> bool:
    plz = re.search(r"\b\d{5}\b", anschrift)
    return bool(plz and plz_muster.fullmatch(plz.group()))


def auswaehlen(pfad: Path, ort: str, plz_muster: re.Pattern, max_je_branche: int | None):
    with pfad.open(encoding="utf-8-sig") as datei:
        alle = list(csv.DictReader(datei, delimiter=";"))

    domain_zaehler = Counter(domain(z) for z in alle if z["website"])
    gruende: Counter = Counter()
    treffer = []

    for zeile in alle:
        if zeile["ort"] != ort:
            continue
        if not zeile["email"]:
            gruende["keine E-Mail"] += 1
            continue
        if KONZERN.search(zeile["firma"]) or GROSSFORM.search(zeile["firma"]):
            gruende["Konzern oder AG/SE"] += 1
            continue
        if FILIALE.search(zeile["firma"]):
            gruende["Filiale/Niederlassung"] += 1
            continue
        if zeile["website"] and domain_zaehler[domain(zeile)] > 1:
            gruende["Kette (Domain mehrfach)"] += 1
            continue
        if zeile["postanschrift_impressum"] and not im_zielort(
            zeile["postanschrift_impressum"], plz_muster
        ):
            gruende["Zentrale ausserhalb"] += 1
            continue
        if not zeile["ansprechpartner"]:
            gruende["kein Inhaber im Impressum"] += 1
            continue
        treffer.append(zeile)

    treffer.sort(key=lambda z: (z["branche_suchbegriff"], z["firma"].lower()))

    if max_je_branche:
        je_branche: Counter = Counter()
        begrenzt = []
        for zeile in treffer:
            branche = zeile["branche_suchbegriff"]
            if je_branche[branche] >= max_je_branche:
                gruende[f"Deckel {branche}"] += 1
                continue
            je_branche[branche] += 1
            begrenzt.append(zeile)
        treffer = begrenzt

    return treffer, gruende


def schreiben(treffer: list[dict], ziel: Path) -> None:
    with ziel.open("w", encoding="utf-8", newline="") as datei:
        writer = csv.writer(datei)
        writer.writerow(SPALTEN)
        for versatz, zeile in enumerate(treffer):
            z = versatz + 2  # Zeile 1 ist die Kopfzeile
            anschrift = f"{zeile['strasse']}, {zeile['plz']} {zeile['ort']}".strip(", ")
            writer.writerow([
                versatz + 1,
                zeile["firma"],
                zeile["ansprechpartner"],
                primaeradresse(zeile),
                "", "", "", "", "", "",
                FORMEL_FOLLOWUP.format(z=z),
                FORMEL_STATUS.format(z=z),
                anschrift,
                zeile["telefon"],
                zeile["website"],
                zeile["branche_suchbegriff"],
                f"{zeile['bewertung']} ({zeile['bewertungen_anzahl']})"
                if zeile["bewertung"] else "",
                "",
            ])


def main() -> int:
    basis = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", default=str(basis / "leads.csv"))
    parser.add_argument("--ort", default="Berlin")
    parser.add_argument("--out", default=str(basis / "sheets-liste.csv"))
    parser.add_argument("--max-je-branche", type=int, default=None)
    args = parser.parse_args()

    treffer, gruende = auswaehlen(
        Path(args.csv), args.ort, BERLIN_PLZ, args.max_je_branche
    )
    schreiben(treffer, Path(args.out))

    print(f"{len(treffer)} Firmen in {args.ort}")
    for grund, anzahl in gruende.most_common():
        print(f"  aussortiert — {grund}: {anzahl}")
    branchen = Counter(z["branche_suchbegriff"] for z in treffer)
    print("  Branchen:", dict(branchen))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
