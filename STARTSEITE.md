# Startseite elevo.solutions (Mandantengewinnung für Kanzleien)

Zielgruppe: Rechtsanwälte und Kanzleien in Deutschland mit 2 bis 10 Mitarbeitenden, die planbar mehr Mandanten wollen und nicht mehr nur von Empfehlungen abhängig sein wollen. Ziel der Seite: Formularanfrage, Mert ruft an.

Entstanden mit einem Team aus Spezialisten (Copywriting, Conversion, SEO, Webdesign/Bildauswahl), Stand 07.11.2026.

- `https://elevo.solutions/` – Startseite (`index, follow`, in der Sitemap)
- `https://elevo.solutions/danke/` – Danke-Seite (`noindex`, nicht in der Sitemap), hier und nur hier lädt der Meta Pixel
- `https://elevo.solutions/mert-efe-celik.vcf` – „Nummer speichern“

**Alle Texte, IDs und Links stehen in `src/config/startseite.json`.** Die Komponenten in `src/startseite/components/` lesen nur aus dieser Datei.

## Aufbau

1. **Hero:** ganz oben der Angebotssatz als H1 (was, für wen, Methode, Ergebnis), darunter Button „Rückruf anfordern“, Porträt „Ich rufe Sie persönlich an“, drei Vertrauenspunkte (ohne Bild)
2. **01 Ihr Alltag:** sechs Szenen aus dem Kanzleialltag zum Wiedererkennen
3. **02 Die Ursache** (dunkel): Mandate gehen nach der Anfrage verloren, zwei Studien mit Quellen
4. **03 Die Methode:** fünf Schritte, dann die Anzeigen
5. **04 Die Ergebnisse:** nur belegte Zahlen, ehrlicher Hinweis „noch keine Kanzlei-Referenz“, Über mich
6. **05 Das Angebot:** Pilotplätze, Konditionen, Garantie mit Bedingung, Passt/passt nicht
7. **Ihre Anfrage:** Formular (4 Schritte)
8. **06 Fragen**, Abschluss-CTA, Footer mit Kontakt

## SEO

- Haupt-Keyword: „Mandantengewinnung für Kanzleien“ (Eyebrow, Title, Description, strukturierte Daten)
- Title: `seo.title`, Description: `seo.description`
- Strukturierte Daten (im Layout): ProfessionalService (Adresse aus dem Impressum), Person, Service mit Zielgruppe, WebSite, WebPage, FAQPage (aus `faq`)
- OG-Bild: `public/og-startseite.jpg` (1200 × 630)
- Sitemap: nur indexierbare Seiten (Danke-Seiten, Ads-Landingpages, Previews und andere `noindex`-Seiten sind ausgefiltert, siehe `astro.config.mjs`)
- Nach dem Livegang: in der Google Search Console die Sitemap einreichen und `https://elevo.solutions/` zur Indexierung anfragen.

## Bilder

In `src/startseite/images/` (Astro erzeugt AVIF/WebP in mehreren Breiten mit Hash im Dateinamen). Stockbilder von Unsplash (Unsplash-Lizenz, kommerziell frei nutzbar):

| Datei | Unsplash-ID | Fotograf | Sektion |
|---|---|---|---|
| anwaeltin-telefon-schreibtisch-ordner | 3IdYKyLEjXo | Vitaly Gariev | Ihr Alltag (Desktop) |
| smartphone-benachrichtigung-hand | 9_SaFlgwFdA | Jae Park | Methode (Desktop) |
| unterschrift-mandatsvereinbarung | HJckKnwCXxQ | Gabrielle Henderson | Angebot (Desktop) |
| sekretariat-rueckruf-telefon | wIrTa_D3uNU | Lynn Van den Broeck | Formular (Desktop) |
| mert-efe-celik | eigenes Foto | | Hero, Über mich |

## Vor dem Livegang / offen

```bash
bun run check:placeholders
```

1. **HubSpot-Formular „Startseite“** anlegen mit den Feldern `firstname`, `lastname`, `company`, `phone`, `email`, `lead_rechtsgebiet`, `lead_kanzlei_groesse`, `lead_rueckruf`, `lp_variante`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`. Die Forms API speichert nur Felder, die im Formular stehen. Dann `form.hubspot.formGuid` eintragen. Solange die ID leer ist, zeigt das Formular beim Absenden die Fehlermeldung mit Telefonnummer.
2. **HubSpot-Property `lead_rechtsgebiet`** (Dropdown) mit den internen Werten `familienrecht`, `arbeitsrecht`, `erbrecht`, `verkehrsrecht`, `mietrecht`, `anderes` anlegen.

## Freie Plätze ändern

Nur von Hand: `pilot.free` senken, committen, pushen. Bei `0` erscheint `pilot.soldOut`. /familienrecht zählt separat (`pilot.freePlaces` in `familienrecht.json`), beide gleich halten.

## Formular und Tracking

- 4 Schritte: Rechtsgebiet, Kanzleigröße, wer ruft zurück, Kontakt. Dropdown-Properties bekommen die internen Werte aus `hubspotValues`, Telefon als `+49…`, `lp_variante = startseite`, UTM und `fbclid` aus dem ersten Aufruf. Weiterleitung auf `/danke/` nur bei Erfolg.
- Auf `/` lädt kein Tracking; der Consent-Banner öffnet sich dort nicht von selbst (nur über „Cookie-Einstellungen“ im Footer). Auf `/danke/` genau ein `Lead` nach frischem Absenden und mit Einwilligung, der Banner fragt dort bei Bedarf nach.

## Design

Weiß als Hintergrund, Elevo-Blau als Akzent, eine Schrift.

- Farben (in `src/startseite/styles/global.css`, `@theme`): Fläche Weiß `#FFFFFF`, Flächen-Grau `#F6F8FB`, Text `#0B1324`, Linien `#E5E9F0`. Elevo-Blau `#3B82F6` (aus Logo/Favicon) für Logo und Dekor; für Buttons, Links und hervorgehobene Wörter das dunklere Blau `#2563EB` (AA-Kontrast auf Weiß), auf dunklen Flächen `#7FB0FF`.
- Schrift: Geist (variabel, lokal in `public/fonts/Geist-*.woff2`) für Überschriften und Text.
- Hero ohne Bild: zentriert, feines Raster mit blauem Schimmer im Hintergrund, Angebotssatz als H1, Button, Porträt, drei Vertrauenspunkte.
- `*Wort*` in Config-Texten wird in Blau hervorgehoben.
- Bilder (Desktop) mit Bildunterschrift „Abb. n · …“, abgerundete Ecken.
