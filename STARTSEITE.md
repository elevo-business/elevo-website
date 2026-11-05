# Startseite elevo.solutions (Marketing-Thesis für Familienrecht-Kanzleien)

Die Startseite `/` erzählt die Marketing-Thesis: Kanzleien brauchen nicht zuerst mehr Anfragen, sondern einen Prozess, der aus Anfragen Mandate macht. Jede Sektion ist ein Baustein der Thesis, am Ende steht eine Handlung: Formular ausfüllen, Mert ruft an.

- `https://elevo.solutions/` – Startseite (`index, follow`, in der Sitemap, Schema.org `Organization` + `FAQPage`)
- `https://elevo.solutions/danke/` – Danke-Seite (`noindex, nofollow`, nicht in der Sitemap), hier und nur hier lädt der Meta Pixel
- `https://elevo.solutions/mert-efe-celik.vcf` – „Nummer speichern“

Reihenfolge = Thesis: Problem (Hero) → Hypothese → Antithese → Diagnose → Mechanismus → Beweise → Angebot → Formular → Für wen → FAQ → Footer.

**Alle Texte, IDs und Links stehen in `src/config/startseite.json`.** Die Blöcke heißen wie die Thesis-Bausteine (`problem`, `hypothesis`, `antithesis`, `diagnosis`, `mechanism`, `proof`, `pilot`, `form`, `fit`, `faq`). Die Komponenten in `src/startseite/components/` lesen nur aus dieser Datei.

Die alte Startseite (Fulfillment-Center) ist in der Git-Historie erhalten. Alle anderen Seiten bleiben unverändert.

---

## 1. Vor dem Livegang (Mert)

```bash
bun run check:placeholders
```

Listet alle offenen `[…]`/`[NEED: …]`-Texte, leere IDs und fehlende Dateien.

1. **HubSpot-Formular „Startseite“** anlegen (Marketing → Formulare) mit den Feldern `firstname`, `lastname`, `company`, `phone`, `email`, `lead_kanzlei_groesse`, `lead_rueckruf`, `lead_werbebudget`, `lp_variante` sowie `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid` (die letzten als ausgeblendete Felder). Die Properties gibt es schon. **Wichtig:** Die Forms API speichert nur Felder, die im Formular stehen. Dann `form.hubspot.formGuid` eintragen. Solange die ID leer ist, zeigt das Formular beim Absenden die Fehlermeldung mit Telefonnummer.
2. **Thesis-Video** bei Bunny Stream hochladen: `video.bunnyLibraryId`, `video.videoId` eintragen, Posterbild als `public/thesis-poster.webp` (1280 × 720). Ohne Video-ID wird der Video-Block nicht angezeigt. Alternativ Vimeo: `"provider": "vimeo"` (läuft mit `dnt=1`).
3. **Garantie-Wortlaut** (`pilot.bullets[1]`) gegen den Kundenvertrag prüfen. `pilot.guaranteeNote` bleibt leer, ein Text dort erscheint klein unter dem Angebot.
4. **OG-Bild** (Standbild aus dem Video, 1200 × 630) als `public/og-startseite.jpg`. Bis dahin wird `/og-image.jpg` verwendet.

## 2. Freie Plätze ändern

Die Zahl ändert sich nie automatisch. Nach jedem Vertragsabschluss `pilot.free` um 1 senken, committen, pushen (Coolify deployt). Bei `0` erscheint der Text aus `pilot.soldOut`. Die Startseite und /familienrecht zählen getrennt (`pilot.free` hier, `pilot.freePlaces` in `familienrecht.json`): beide gleich halten.

## 3. Kanzlei-Referenz ergänzen

`proof.items[2]` (`value`, `label`, `name`, optional `text`) füllen, sobald Ergebnisse vorliegen und die Kanzlei zugestimmt hat. Leer = unsichtbar.

## 4. Formular und Versand

- 4 Schritte: Kanzleigröße, Rückruf, Werbebudget (Kacheln, Klick springt nach 250 ms weiter), dann Kontakt + Einwilligung. Kein harter Ausschluss.
- Versand per HubSpot Forms API (`portalId` 149380660). Dropdown-Properties bekommen die internen Werte aus `hubspotValues` (z. B. `2_3`, `niemand`, `unter_1000`), Telefon als `+49…`, `lp_variante = startseite`, UTM-Werte und `fbclid` aus dem ersten Aufruf.
- Weiterleitung auf `/danke/` nur bei Erfolg; sonst Fehlermeldung und `console.error` mit der HubSpot-Antwort.
- Ohne JavaScript stehen alle Fragen untereinander, das Formular geht an den HubSpot-Legacy-Endpunkt.

## 5. Tracking und Einwilligung

- Auf `/` lädt **kein** Pixel und kein anderes Tracking (auch nicht der seitenweite Google-Tag des BaseLayouts).
- Auf `/danke/` genau ein `Lead` mit `eventID`, nur nach frischem Absenden (≤ 30 Min.) und mit Marketing-Einwilligung. Neuladen zählt keinen zweiten Lead.
- Einwilligung wird mit dem Rest von elevo.solutions geteilt (`elevo_consent_v2`).

## 6. Design

Gestaltet wie ein Thesenpapier: Jede Sektion trägt am Rand ihre Nummer und Rubrik („02 — Die naheliegende Antwort“), getrennt durch feine Linien statt Karten mit Schatten. Auf dem Desktop steht neben der These die Gliederung der Thesis.

- Farben: Off-White (`#F7F6F2`), Navy (`#0E1A30`), Gold (`#D6B062`) für Buttons, Zahlen und Prozess-Nummern; auf hellem Grund ein dunkleres Gold für Text (Kontrast AA). Die Diagnose ist die einzige dunkle Sektion.
- Schrift: Überschriften in Newsreader (Serife), Fließtext in Inter, beide lokal (`public/fonts/`).
- Hervorhebung: `*Wort*` in einem Config-Text wird kursiv in Gold gesetzt (z. B. in `problem.h1`).
- Persönlich: `pilot.person` zeigt im Angebot das Porträt mit „Ich rufe Sie persönlich an.“ (`image` leer = ausgeblendet).
- Einziges animiertes Element: die Prozess-Grafik (respektiert `prefers-reduced-motion`).

## Projektstruktur

```
src/config/startseite.json         alle Texte, IDs, Links
src/pages/index.astro              Startseite
src/pages/danke.astro              Danke-Seite
src/pages/mert-efe-celik.vcf.ts    vCard
src/startseite/
  components/  Section (Rahmen mit Rubrik), Rich (*Hervorhebung*), Header, Hero, VideoFacade, Hypothesis, Antithesis, Diagnosis, Mechanism, Proof, Offer,
               QuizForm, Fit, Faq, StickyCta, ConsentBanner, Footer, Logo, CtaButton, CheckIcon
  layouts/SsLayout.astro           eigenes Layout ohne seitenweites Tracking
  styles/global.css                Tailwind (nur für diese Seiten), Inter, Farben
  lib/answers.ts                   Quiz-Zwischenstand (sessionStorage)
```

HubSpot-Versand, UTM, Einwilligung und Pixel nutzen dieselben Bausteine wie /neukundensystem (`src/neukundensystem/lib/`).
