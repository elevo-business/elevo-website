#!/usr/bin/env python3
"""Legt die 3 Physio-Kampagnen in Instantly an (API v2) und verteilt die Leads.

Nutzung:
    INSTANTLY_API_KEY=xxx python3 instantly-upload.py            # anlegen + Leads hochladen
    INSTANTLY_API_KEY=xxx python3 instantly-upload.py --dry-run  # nur zeigen, nichts senden

Erwartet leads-physio-100.csv im selben Ordner (Spalten: email, firstName,
lastName, anrede, companyName, city, website, greeting). Kampagnen starten
PAUSIERT — Sende-Postfächer in der Instantly-UI zuweisen, dann aktivieren.
"""
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.instantly.ai/api/v2"
DRY = "--dry-run" in sys.argv
KEY = os.environ.get("INSTANTLY_API_KEY", "")
if not KEY and not DRY:
    sys.exit("INSTANTLY_API_KEY ist nicht gesetzt.")

HERE = os.path.dirname(os.path.abspath(__file__))
SEQ_FILE = os.path.join(HERE, "sequenzen-instantly.md")
CSV_FILE = os.path.join(HERE, "leads-physio-100.csv")


def req(method, path, data=None):
    r = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:800]
        print(f"HTTP {e.code} bei {method} {path}:\n{body}", file=sys.stderr)
        raise


def parse_sequences(md):
    """Liest die Copy-Paste-Datei und baut daraus die drei Kampagnen-Sequenzen."""
    campaigns = []
    current = None
    for block in md.split("\n## ")[1:]:
        title = block.splitlines()[0].strip()
        if not title.startswith("KAMPAGNE"):
            continue
        current = {"name": f"Physio 500er — {title.split('—')[1].strip().strip(chr(8222) + chr(8220) + chr(34))}", "steps": []}
        for step_block in block.split("\n### ")[1:]:
            lines = step_block.splitlines()
            header = lines[0]
            day = int("".join(c for c in header.split("Tag")[1] if c.isdigit()))
            subject = ""
            for ln in lines:
                if ln.startswith("**Betreff:**"):
                    subject = ln.split("`")[1]
                    break
            body = step_block.split("```")[1].strip()
            current["steps"].append({"day": day, "subject": subject, "body": body})
        campaigns.append(current)
    return campaigns


def build_payload(c):
    steps = []
    prev_day = 0
    for s in c["steps"]:
        steps.append({
            "type": "email",
            "delay": max(s["day"] - prev_day, 0),
            "variants": [{"subject": s["subject"], "body": s["body"]}],
        })
        prev_day = s["day"]
    return {
        "name": c["name"],
        "campaign_schedule": {
            "schedules": [{
                "name": "Behandlungspausen",
                "timing": {"from": "07:00", "to": "10:30"},
                "days": {"1": True, "2": True, "3": True, "4": True},
                "timezone": "Europe/Berlin",
            }]
        },
        "sequences": [{"steps": steps}],
        "text_only": True,
        "stop_on_reply": True,
        "link_tracking": False,
        "open_tracking": False,
        "daily_limit": 30,
    }


def main():
    md = open(SEQ_FILE, encoding="utf-8").read()
    campaigns = parse_sequences(md)
    leads = list(csv.DictReader(open(CSV_FILE, encoding="utf-8")))
    print(f"{len(campaigns)} Kampagnen geparst, {len(leads)} Leads geladen.")

    for i, c in enumerate(campaigns):
        payload = build_payload(c)
        chunk = leads[i::len(campaigns)]  # Round-Robin-Verteilung
        print(f"\n→ {payload['name']}: {len(payload['sequences'][0]['steps'])} Schritte, {len(chunk)} Leads")
        if DRY:
            print(json.dumps(payload, ensure_ascii=False)[:400] + " …")
            continue
        created = req("POST", "/campaigns", payload)
        cid = created.get("id")
        print(f"  Kampagne angelegt: {cid}")
        ok = 0
        for lead in chunk:
            body = {
                "campaign": cid,
                "email": lead["email"],
                "first_name": lead["firstName"],
                "last_name": lead["lastName"],
                "company_name": lead["companyName"],
                "custom_variables": {
                    "greeting": lead["greeting"],
                    "anrede": lead["anrede"],
                    "city": lead["city"],
                    "website": lead["website"],
                },
            }
            try:
                req("POST", "/leads", body)
                ok += 1
            except urllib.error.HTTPError:
                print(f"  Lead übersprungen: {lead['email']}")
            time.sleep(0.15)  # API-Rate-Limit schonen
        print(f"  Leads hochgeladen: {ok}/{len(chunk)}")

    if not DRY:
        print("\nFertig. Nächste Schritte in der Instantly-UI:")
        print("1. Sende-Postfächer jeder Kampagne zuweisen (Warm-up beachten!)")
        print("2. Vorschau je Kampagne prüfen ({{greeting}} muss aufgelöst werden)")
        print("3. Kampagnen aktivieren")


if __name__ == "__main__":
    main()
