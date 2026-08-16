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
from datetime import date
from pathlib import Path

from leadtool.config import (
    Blocklist,
    ConfigError,
    load_api_key,
    load_targets,
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


def cmd_run(args: argparse.Namespace) -> int:
    ziele = load_targets(Path(args.config))
    anzahl = len(ziele.queries)
    print(
        "Der Volllauf (Cache, Dedup, Impressum, CSV) ist noch nicht freigegeben.\n"
        f"Config waere: {anzahl} Query-Kombinationen "
        f"({len(ziele.suchbegriffe)} Suchbegriffe x {len(ziele.staedte)} Staedte), "
        f"Budget {ziele.limits.max_api_calls} API-Aufrufe.\n"
        f"Ausgabe waere: {args.out}\n"
        "Fuer den Datencheck zuerst: python leads.py probe --suchbegriff ... --stadt ...",
        file=sys.stderr,
    )
    return 2


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
    p_run.set_defaults(func=cmd_run)

    args = parser.parse_args(argv)
    try:
        return int(args.func(args))
    except ConfigError as fehler:
        print(f"Konfigurationsfehler: {fehler}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
