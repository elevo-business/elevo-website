# Lead-Recherche-Tool

Erzeugt aus Branchen- und Ortsangaben eine qualifizierte Firmenliste (Postanschrift
im Fokus, E-Mail nur als Nebenfeld). Datenquellen: Google Places API v1 und das
oeffentliche Impressum der jeweiligen Firmen-Website.

**Das Tool erzeugt ausschliesslich Dateien. Es verschickt nichts und bekommt auch
keine Versandfunktion.**

## Setup

```bash
cd tools/leads
pip install -r requirements.txt
cp .env.example .env      # danach GOOGLE_PLACES_API_KEY eintragen
```

`.env` ist per `.gitignore` ausgeschlossen und darf nie eingecheckt werden.

## Benutzung

Einzelne Query pruefen (Rohausgabe als JSON):

```bash
python leads.py probe --suchbegriff "Ingenieurbüro TGA" --stadt "Berlin" --max-seiten 1
```

Volllauf ueber die Config (Schritte 3–6, noch nicht freigegeben):

```bash
python leads.py run --config targets.yaml --out leads.csv
```

## Dateien

| Datei | Zweck |
|-------|-------|
| `targets.yaml` | Suchbegriffe, Staedte, Filter, Kostenbremse, Crawl-Einstellungen |
| `blocklist.txt` | Domains/E-Mails, die nie in der Ausgabe landen |
| `.env` | API-Key (nicht im Repo) |
| `leadtool/config.py` | Config-, Key- und Blocklist-Handling |
| `leadtool/places.py` | Places API v1 (`places:searchText`), Filter, Kostenbremse |

## Places API

- Endpoint `https://places.googleapis.com/v1/places:searchText` (POST), neue API,
  nicht Legacy.
- Header `X-Goog-Api-Key`, `X-Goog-FieldMask`. Die FieldMask bestimmt die
  Abrechnungsstufe — dort nichts ohne Grund ergaenzen.
- `languageCode: de`, `regionCode: DE`, `pageSize: 20`.
- Paginierung ueber `nextPageToken`, max. 3 Seiten ≈ 60 Treffer pro Query. Das ist
  eine harte Grenze der API. Volumen entsteht nur ueber Suchbegriffe × Staedte,
  dedupliziert wird ueber die Place-ID.
- Wiederholungen (tenacity) nur bei 429 und 5xx. 400/403 sind Konfigurationsfehler
  und werden nicht wiederholt, weil das nur Geld kostet.

## Eingebaute Leitplanken

1. **Sperrliste** — `blocklist.txt` wird beim Start gelesen, Domains inkl. Subdomains
   und E-Mail-Adressen werden aus der Ausgabe gefiltert.
2. **Keine Versandfunktion** — Recherche und Versand bleiben getrennt.
3. **Kostenbremse** — Zaehler ueber alle API-Aufrufe, Limit in
   `targets.yaml` (`limits.max_api_calls`), harter Abbruch beim Erreichen.
   Preise und Freikontingent vor jedem groesseren Lauf in der Google Cloud Console
   pruefen, die aendern sich.
4. **Herkunft dokumentiert** — jede Ausgabe traegt Abrufdatum und Quelle.
5. **Personenbezug gekennzeichnet** — Spalte `email_typ` unterscheidet
   Funktionspostfach (`funktion`) von personenbezogener Adresse (`personen`).

## Bewusst nicht enthalten

Kein Umgehen von Bot-Schutz, keine Captcha-Loesung, keine Rate-Limit-Tricks, kein
Raten von E-Mail-Adressen aus Namensmustern, kein Abgreifen von LinkedIn/Xing, kein
Zusammenfuehren mit Fremddaten zu Personenprofilen.

## Stand

- [x] Schritt 1 — Projektgeruest, `.env`-Handling, Config-Parsing
- [x] Schritt 2 — Places-Abfrage, Rohausgabe als JSON
- [ ] Schritt 3 — Cache-Schicht und Deduplizierung
- [ ] Schritt 4 — Impressum-Modul
- [ ] Schritt 5 — CSV-Export
- [ ] Schritt 6 — Volllauf
