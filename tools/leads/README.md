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

Volllauf ueber die Config:

```bash
python leads.py run --config targets.yaml --out leads.csv
```

Optionen fuer `run`:

| Option | Wirkung |
|--------|---------|
| `--cache cache.sqlite` | Pfad zum lokalen Cache |
| `--refresh` | Cache ignorieren, alles neu abrufen (kostet erneut API-Aufrufe) |
| `--ohne-impressum` | Nur Places-Daten, keine Website-Auswertung |
| `--max-domains N` | Impressum nur fuer die ersten N Domains (zum Testen) |

Ein Abbruch ist unkritisch: abgeschlossene Queries und ausgewertete Domains liegen
im SQLite-Cache und werden beim naechsten Start uebersprungen. Ein zweiter Lauf mit
derselben Config kostet null API-Aufrufe.

## Dateien

| Datei | Zweck |
|-------|-------|
| `targets.yaml` | Suchbegriffe, Staedte, Filter, Kostenbremse, Crawl-Einstellungen |
| `blocklist.txt` | Domains/E-Mails, die nie in der Ausgabe landen |
| `.env` | API-Key (nicht im Repo) |
| `cache.sqlite` | Lokaler Cache: Queries, Places, Impressum-Ergebnisse (nicht im Repo) |
| `leadtool/config.py` | Config-, Key- und Blocklist-Handling |
| `leadtool/places.py` | Places API v1 (`places:searchText`), Filter, Kostenbremse |
| `leadtool/cache.py` | SQLite-Cache, macht Laeufe idempotent und wiederaufnehmbar |
| `leadtool/impressum.py` | robots.txt, Impressum-Suche, Extraktion |
| `leadtool/csvout.py` | CSV-Export (UTF-8 mit BOM, Semikolon) |
| `export_mailtracking.py` | Traegt Kontakte aus `leads.csv` in die Mail-Tracking-Mappe ein |

## Mail-Tracking-Mappe befuellen

```bash
python export_mailtracking.py --csv leads.csv --xlsx MailTracking-ELEVO.xlsx
```

Schreibt nur Nr, Firma, Ansprechpartner, E-Mail und Notiz in das Blatt `Mails`
(ab Zeile 3, die Beispielzeile bleibt stehen). Versanddatum, Variante und
Antwortart bleiben leer — die traegt der Mensch ein. Formeln, Dropdowns und
Formatierung der Vorlage werden nicht angefasst.

Nur Firmen mit E-Mail landen dort. Als Primaeradresse wird das Funktionspostfach
bevorzugt; mehrfach genutzte Sammeladressen erscheinen nur einmal, mit Vermerk in
der Notiz. Fuer den Postversand bleibt `leads.csv` die vollstaendige Quelle.

## CSV-Spalten

`firma; strasse; plz; ort; telefon; website; email; email_typ; ansprechpartner;
branche_suchbegriff; bewertungen_anzahl; bewertung; place_id; impressum_url;
impressum_status; postanschrift_impressum; handelsregister; abgerufen_am; quelle;
score; notiz`

- `postanschrift_impressum` steht nur dann drin, wenn das Impressum eine **andere**
  Anschrift nennt als der Google-Eintrag (z. B. Hauptsitz statt Niederlassung).
- `handelsregister` als Qualitaetssignal (HRB/HRA-Nummer).
- Mehrere E-Mails stehen pipe-getrennt in `email`; `email_typ` haelt dieselbe
  Reihenfolge ein, damit pro Adresse erkennbar bleibt, was Funktionspostfach ist.
- `score` und `notiz` bleiben leer — die werden beim Sichten von Hand gefuellt.

### Werte in `impressum_status`

| Status | Bedeutung |
|--------|-----------|
| `ok` | Impressumsseite gefunden und ausgewertet |
| `ok_email_von_startseite` | Impressum ohne E-Mail, Adresse stammt von der Startseite |
| `ok_nur_startseite` | Seitenbudget erlaubte nur die Startseite |
| `robots_disallow` | robots.txt verbietet den Abruf — Firma bleibt in der Liste |
| `impressum_http_404` u. a. | Startseite ok, Impressumsseite nicht abrufbar |
| `http_403`, `timeout`, `verbindungsfehler` | Website nicht erreichbar |
| `keine_website` | Google kennt keine Website zu dem Eintrag |

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
- [x] Schritt 3 — Cache-Schicht und Deduplizierung ueber die Place-ID
- [x] Schritt 4 — Impressum-Modul
- [x] Schritt 5 — CSV-Export
- [x] Schritt 6 — Volllauf
