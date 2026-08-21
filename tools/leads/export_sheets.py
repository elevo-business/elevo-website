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

from leadtool.impressum import primaeradresse

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

# Google Sheets erwartet in deutscher Locale das Semikolon als Argumenttrenner;
# mit Komma wirft jede mehrargumentige Formel #ERROR!. Der Trenner ist deshalb
# ueber --trenner umstellbar.
# Eine ARRAYFORMULA in Zeile 2 rechnet die ganze Spalte durch — robuster als
# 500 Einzelformeln und uebersteht das Einfuegen neuer Zeilen.
FORMEL_FOLLOWUP = (
    '=ARRAYFORMULA(IF(F2:F500=""{t}""{t}IF(I2:I500<>""{t}"beantwortet"{t}'
    'IF(G2:G500=""{t}F2:F500+5{t}IF(H2:H500=""{t}F2:F500+12{t}'
    '"Sequenz beendet")))))'
)
FORMEL_STATUS = (
    '=ARRAYFORMULA(IF(K2:K500=""{t}""{t}IF(ISNUMBER(K2:K500){t}'
    'IF(K2:K500<=TODAY(){t}"FÄLLIG"{t}"in "&(K2:K500-TODAY())&" Tagen"){t}'
    'K2:K500)))'
)


def auswertung(t: str) -> dict[int, list[str]]:
    """Auswertungsblock rechts neben den Daten (Spalten T bis W)."""
    return {
        1: ["Auswertung", "", "", ""],
        2: ["Mails versendet", "=COUNT($F$2:$F$500)", "", ""],
        3: ["Antworten", "=COUNT($I$2:$I$500)", "", ""],
        4: ["Antwortquote", f'=IF($U$2=0{t}""{t}$U$3/$U$2)', "", ""],
        5: ["davon Zusagen", f'=COUNTIF($J$2:$J$500{t}"Zusage")', "", ""],
        6: ["Zusagequote", f'=IF($U$2=0{t}""{t}$U$5/$U$2)', "", ""],
        8: ["Variante", "Versendet", "Antworten", "Quote"],
        **{
            zeile: [
                variante,
                f'=COUNTIFS($E$2:$E$500{t}$T{zeile}{t}$F$2:$F$500{t}">0")',
                f'=COUNTIFS($E$2:$E$500{t}$T{zeile}{t}$I$2:$I$500{t}">0")',
                f'=IF(U{zeile}=0{t}""{t}V{zeile}/U{zeile})',
            ]
            for zeile, variante in ((9, "A"), (10, "B"), (11, "C"))
        },
        13: ["Variante", "A, B, C", "", ""],
        14: ["Antwortart", "offen, Zusage, Absage, Rückfrage, später", "", ""],
        15: ["Dropdowns", "Spalte E bzw. J markieren, dann Daten > Datenvalidierung",
             "", ""],
    }


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


def schreiben(treffer: list[dict], ziel: Path, trenner: str) -> None:
    block = auswertung(trenner)

    def mit_auswertung(zeile: list, nr: int) -> list:
        """Datenzeile um Leerspalte und Auswertungsblock ergaenzen."""
        return zeile + [""] + block.get(nr, ["", "", "", ""])

    with ziel.open("w", encoding="utf-8", newline="") as datei:
        writer = csv.writer(datei)
        writer.writerow(mit_auswertung(SPALTEN, 1))
        for versatz, zeile in enumerate(treffer):
            z = versatz + 2  # Zeile 1 ist die Kopfzeile
            anschrift = f"{zeile['strasse']}, {zeile['plz']} {zeile['ort']}".strip(", ")
            writer.writerow(mit_auswertung([
                versatz + 1,
                zeile["firma"],
                zeile["ansprechpartner"],
                primaeradresse(zeile["email"].split("|")),
                "", "", "", "", "", "",
                FORMEL_FOLLOWUP.format(t=trenner) if z == 2 else "",
                FORMEL_STATUS.format(t=trenner) if z == 2 else "",
                anschrift,
                zeile["telefon"],
                zeile["website"],
                zeile["branche_suchbegriff"],
                f"{zeile['bewertung']} ({zeile['bewertungen_anzahl']})"
                if zeile["bewertung"] else "",
                "",
            ], z))


def rest_auswertung(anzahl_treffer: int, ziel: Path, trenner: str) -> None:
    """Auswertungszeilen ergaenzen, die hinter der letzten Datenzeile liegen."""
    block = auswertung(trenner)
    letzte_datenzeile = anzahl_treffer + 1
    fehlend = [nr for nr in sorted(block) if nr > letzte_datenzeile]
    if not fehlend:
        return
    with ziel.open("a", encoding="utf-8", newline="") as datei:
        writer = csv.writer(datei)
        for nr in range(letzte_datenzeile + 1, max(fehlend) + 1):
            writer.writerow([""] * len(SPALTEN) + [""] + block.get(nr, ["", "", "", ""]))


def main() -> int:
    basis = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", default=str(basis / "leads.csv"))
    parser.add_argument("--ort", default="Berlin")
    parser.add_argument("--out", default=str(basis / "sheets-liste.csv"))
    parser.add_argument("--max-je-branche", type=int, default=None)
    parser.add_argument(
        "--trenner",
        default=";",
        help="Argumenttrenner in den Formeln: ';' fuer deutsche Locale, ',' fuer englische",
    )
    args = parser.parse_args()

    treffer, gruende = auswaehlen(
        Path(args.csv), args.ort, BERLIN_PLZ, args.max_je_branche
    )
    schreiben(treffer, Path(args.out), args.trenner)
    rest_auswertung(len(treffer), Path(args.out), args.trenner)

    print(f"{len(treffer)} Firmen in {args.ort}")
    for grund, anzahl in gruende.most_common():
        print(f"  aussortiert — {grund}: {anzahl}")
    branchen = Counter(z["branche_suchbegriff"] for z in treffer)
    print("  Branchen:", dict(branchen))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
