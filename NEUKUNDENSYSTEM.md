# Landingpage /neukundensystem

VSL-Landingpage + Danke-Seite für die eigenen Meta Ads (Neukundensystem), als eigene Seite auf elevo.solutions.
Astro (statisch) + Tailwind CSS, Formular an die HubSpot Forms API, Meta Pixel nur auf der Danke-Seite.

- `https://elevo.solutions/neukundensystem/` – Landingpage: Headline → Video → Formular → Referenzen → FAQ → Abschluss-CTA → Footer
- `https://elevo.solutions/neukundensystem/danke/` – Danke-Seite (noindex, nicht in der Sitemap), hier und nur hier lädt der Meta Pixel

**Wichtig:** Die beiden Seiten nutzen ein eigenes Layout (`src/neukundensystem/layouts/LpLayout.astro`) – **nicht** das BaseLayout der restlichen Website. Dadurch laden dort weder der seitenweite Meta Pixel noch Google Ads/GA4/Clarity. Tailwind wird nur für diese Seiten verwendet (`src/neukundensystem/styles/global.css`); die übrigen Seiten bleiben unverändert.

---

## 1. Texte und Einstellungen ändern

**Alles steht in einer Datei: `src/config/site.json`.** Dort änderst du Texte, Video, FAQ, IDs – ohne Code anzufassen.
Nach jeder Änderung: speichern, committen, pushen → Coolify baut elevo.solutions neu (siehe Abschnitt 4).

Beim Build listet die Konsole alle noch offenen `[Platzhalter]` auf („offene Platzhalter in src/config/site.json“). Vor dem Go-live sollte diese Liste leer sein (bis auf Dinge, die du bewusst offen lässt).

### Was du vor dem Go-live eintragen musst

| Feld in `site.json` | Was |
| --- | --- |
| `form.hubspot.portalId` | HubSpot → Einstellungen → Konto → Portal-ID (Hub-ID) |
| `form.hubspot.formGuid` | HubSpot → Marketing → Formulare → dein Formular → ID aus der URL |
| `tracking.metaPixelId` | Events Manager → Datenquellen → Pixel-ID (nur Ziffern). Solange hier keine Ziffern stehen, lädt **kein** Pixel. |
| `thankYou.phone` | Deine Telefonnummer (wird auf der Danke-Seite und in der Fehlermeldung angezeigt, automatisch als Klick-zum-Anrufen-Link) |
| `faq[7].a` | Garantie-Bedingungen statt `[Bedingungen eintragen]` |
| `testimonials` | Referenzen (siehe unten) |
| `public/neukundensystem/vsl.mp4` | Dein Video (siehe unten) |

### Headline tauschen (A/B/C)

`hero.headline` ist die Headline, die angezeigt wird. Die drei Varianten liegen in `hero.headlineVariants`.
Zum Wechseln den Text der gewünschten Variante in `hero.headline` kopieren.
`hero.note` ist die kurze Zeile unter der Subheadline (Risikoumkehr). Steht in der Headline „ – “ (Gedankenstrich mit Leerzeichen), kommt der Teil danach auf eine eigene Zeile.

### Video

Standard ist ein eigenes Video (wie im Greenchild-Funnel): `vsl.provider: "self"`.

1. Video als MP4 nach `public/neukundensystem/vsl.mp4` legen (oder `vsl.src` auf den Dateinamen ändern).
   Für schnellen Start im Browser vorher web-optimieren:
   ```bash
   ffmpeg -i original.mp4 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/neukundensystem/vsl.mp4
   ```
2. Vorschaubild erzeugen (erstes Bild nach 1 Sekunde):
   ```bash
   ffmpeg -ss 1 -i public/neukundensystem/vsl.mp4 -frames:v 1 -vf scale=720:-1 -q:v 4 public/neukundensystem/vsl-poster.jpg
   ```
   nginx cacht Bilder 1 Jahr. Wenn du das Vorschaubild später austauschst: neuen Dateinamen verwenden (z. B. `vsl-poster-2.jpg`) und `vsl.poster` anpassen.
3. `vsl.aspect`: `"9:16"` für Hochformat (Handy-Video), `"16:9"` für Querformat.

Verhalten: Nach dem Seitenaufbau startet das Video stumm in Schleife, der Button „Mit Ton ansehen“ startet es von vorn mit Ton und Steuerung. Es werden keine Drittanbieter geladen.

Alternativ (2-Klick-Lösung, Player lädt erst nach Klick, mit Hinweis am Play-Button):
- Bunny Stream: `"provider": "bunny"`, `"bunnyLibraryId": "<Library-ID>"`, `"videoId": "<Video-ID>"`
- Vimeo: `"provider": "vimeo"`, `"videoId": "<Vimeo-ID>"` (läuft mit `dnt=1`)

Optional ein Video auf der Danke-Seite: `thankYou.video` auf ein Objekt im selben Format setzen, z. B.
`{ "provider": "self", "src": "/neukundensystem/danke.mp4", "poster": "/neukundensystem/danke-poster.jpg", "aspect": "9:16" }`.

### Referenzen

Eine Karte wird **nur angezeigt, wenn ihre Pflichtangaben echt ausgefüllt sind** (kein Text in `[eckigen Klammern]`). Ist keine Karte vollständig, ist die ganze Sektion unsichtbar.

- Greenchild-Hauptkarte (`"featured": true`): braucht `solution` und `result`. Optional und nur sichtbar, wenn ausgefüllt: `logo`, `tag`, `situation` (Ausgangslage), `stats` (Kennzahlen-Kacheln), `processHeadline` + `process` (nummerierte Funnel-Schritte; ersetzt die Zeile „Lösung“), `quote` + `quoteAuthor` + `quoteRole` + `quoteImage`.
- Weitere Karten: brauchen `name`, `company` und entweder `quote` oder `points` (Stichpunkte). `label`, `result` und `image` sind optional.
- `image`: Pfad zu einem Foto/Logo in `public/` (z. B. `/neukundensystem/greenchild.webp`, quadratisch, WebP).
- `video`: optional, gleiches Format wie oben.

### Formular-Felder und Qualifizierungsfragen

Das Formular läuft in Schritten zum Durchklicken (Fortschrittsbalken oben). Ein Klick auf eine Antwort springt direkt zum nächsten Schritt. An HubSpot wird **einmal am Ende** gesendet – abgebrochene Formulare erzeugen keinen Kontakt.

- `form.steps`: Reihenfolge der Schritte. Ein Schritt mit genau einer Qualifizierungsfrage (z. B. `["werbebudget"]`) wird als Frage mit großen Antwort-Buttons angezeigt; andere Schritte bekommen eine Überschrift (`title`) und die genannten Felder. `"consent"` gehört in den letzten Schritt.
- `form.disqualify`: Antworten, die direkt zur Absage-Seite `https://elevo.solutions/neukundensystem/absage/` führen (aktuell: Kundenwert „unter 2.000 €“). Dann wird **nichts** an HubSpot gesendet und kein Lead an Meta gemeldet. Die Texte der Absage-Seite stehen unter `disqualified` (noindex, nicht in der Sitemap).
- `form.nextText`, `form.backText`, `form.progressText` („Schritt {{n}} von {{total}}“): Texte der Navigation.

- `form.fields`: Beschriftungen und Fehlermeldungen der Textfelder.
- `form.qualifiers`: die Auswahlfragen. `label` = Frage, `hint` = kleine Zeile darunter (optional), `options` = Antworten, `hubspotProperty` = interner Name der HubSpot-Property.
- `form.fieldMapping`: welches Formularfeld in welche HubSpot-Property geschrieben wird. Ist ein Wert leer (`""`), wird das Feld nicht gesendet.

### Farben

`brand.primaryColor` (Text/dunkle Flächen), `brand.accentColor` (nur CTA-Buttons), `brand.accentHoverColor`.
Auf den Buttons steht dunkler Text – die Akzentfarbe muss also hell genug sein.

---

## 2. HubSpot einrichten (einmalig)

Die Forms API nimmt nur Felder an, die es im HubSpot-Formular gibt.

1. **Kontakt-Properties anlegen** (Einstellungen → Properties → Kontakt), Typ „Einzeiliger Text“:
   `lp_situation`, `lp_anrufer`, `lp_startzeitpunkt`, `lp_kundenwert`, `lp_werbebudget`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`
   (Einzeiliger Text, damit die Antworten 1:1 ankommen. Wenn du Dropdowns willst: interne Werte exakt wie die `options` in `site.json`.)
2. **Formular anlegen** (Marketing → Formulare) mit: Vorname, Nachname, E-Mail, Telefonnummer, Firma, Branche (`industry`) und allen Properties aus Schritt 1. Die UTM-Felder und `fbclid` als **ausgeblendete Felder**.
3. **Datenschutz**: Die Seite schickt `consentToProcess: true` mit dem Text der Checkbox mit.
4. **Push aufs Handy**: HubSpot-App installieren, Benachrichtigungen für Formulareinsendungen aktivieren (in den HubSpot-Benachrichtigungseinstellungen unter Formulareinsendungen).
5. `portalId` und `formGuid` in `site.json` eintragen.

Optional für die spätere Conversions API: Property `lp_event_id` anlegen, ins Formular aufnehmen und in `form.fieldMapping.event_id` eintragen. Dann landet dieselbe eventID wie im Pixel in HubSpot (Deduplizierung).

---

## 3. Lokal starten

Voraussetzung: [Bun](https://bun.sh) (oder Node ≥ 22.12 mit npm).

```bash
bun install
bun run dev        # Entwicklungsserver: http://localhost:4321/neukundensystem/
bun run build      # Produktions-Build nach dist/ (zeigt offene Platzhalter)
bun run preview    # gebauten Stand ansehen
```

---

## 4. Deployen (Coolify)

Die Landingpage ist Teil von elevo-website und wird mit der restlichen Website ausgeliefert – kein eigener Server, keine eigene Domain.

1. Änderungen committen und auf den Branch pushen, den Coolify für elevo.solutions baut.
2. Coolify baut automatisch neu (Dockerfile: Bun baut, nginx liefert aus).
3. Prüfen: `https://elevo.solutions/neukundensystem/` und `https://elevo.solutions/neukundensystem/danke/`.

In den Meta Ads als Ziel-URL `https://elevo.solutions/neukundensystem/` eintragen (mit Schrägstrich am Ende, sonst gibt es eine Weiterleitung).

---

## 5. Tracking und Einwilligung – so funktioniert es

- Auf `/neukundensystem/` wird **kein** Pixel und kein anderes Tracking geladen (auch nicht der seitenweite Pixel/Google-Tag von elevo.solutions).
- Nach erfolgreichem Versand an HubSpot speichert die Seite `lead_submitted` (Zeitstempel), `lead_event_id` und `lead_vorname` im sessionStorage und leitet auf `/neukundensystem/danke/` weiter.
- Auf der Danke-Seite lädt der Pixel nur, wenn (1) eine Pixel-ID eingetragen ist, (2) Marketing-Einwilligung vorliegt und (3) der Versand höchstens 30 Minuten her ist. Dann: `init` → `PageView` → `Lead` mit `eventID`. Direkt danach wird `lead_submitted` gelöscht – Neuladen oder erneuter Aufruf zählt keinen zweiten Lead.
- Die Einwilligung wird mit dem Cookie-Banner der restlichen Website geteilt (`elevo_consent_v2`): Wer auf elevo.solutions schon gewählt hat, wird auf der Landingpage nicht noch einmal gefragt – und umgekehrt.
- Consent-Banner: „Alle akzeptieren“ / „Nur notwendige“, gespeichert in localStorage (`consent_marketing` + Datum). Hat jemand nicht zugestimmt, erscheint der Banner auf der Danke-Seite noch einmal; stimmt er dort innerhalb der 30 Minuten zu, wird der Lead noch gezählt. Über „Cookie-Einstellungen“ im Footer lässt sich die Auswahl jederzeit ändern.
- In Meta muss das Kampagnenziel auf das Conversion-Event **Lead** stehen. Da der Pixel nur auf der Danke-Seite liegt, sieht Meta keine Seitenbesuche (kein Retargeting auf Besucher) – das ist so gewollt.

### Testen mit den Meta-Test-Events

1. Events Manager → Pixel → **Test-Events** → URL `https://elevo.solutions/neukundensystem/` öffnen.
2. Formular ausfüllen, „Alle akzeptieren“, absenden → auf der Danke-Seite muss genau **ein** `Lead` erscheinen.
3. Danke-Seite neu laden → kein weiterer Lead.
4. In neuem privaten Fenster „Nur notwendige“ wählen und absenden → kein Pixel. Im Banner auf der Danke-Seite zustimmen → genau ein Lead.

---

## Projektstruktur

```
src/
  config/site.json                    alle Texte, IDs, Links der Landingpage
  pages/neukundensystem/index.astro   Landingpage
  pages/neukundensystem/danke.astro   Danke-Seite
  neukundensystem/
    components/                       Hero, VslFacade, LeadForm, Testimonials, Faq, StickyCta, ConsentBanner, Footer, …
    lib/                              hubspot.ts, utm.ts, consent.ts, pixel.ts, lead.ts, storage.ts, text.ts
    layouts/LpLayout.astro            eigenes Layout ohne seitenweites Tracking
    styles/global.css                 Tailwind (nur für diese Seiten)
    integrations/                     Build-Hinweis auf offene Platzhalter
public/neukundensystem/               VSL-Video + Vorschaubild
```

Impressum und Datenschutz verlinken auf die bestehenden Seiten `/impressum` und `/datenschutz` (`legal` in `site.json`).
