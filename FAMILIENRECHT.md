# Landingpage /familienrecht (Pilotkanzleien)

Landingpage für die eigenen Meta Ads an Kanzleien mit Schwerpunkt Familienrecht. Aufbau wie /neukundensystem: Astro (statisch) + Tailwind, eigenes Layout ohne seitenweites Tracking, Formular an die HubSpot Forms API, Meta Pixel nur auf der Danke-Seite.

- `https://elevo.solutions/familienrecht/`: Headline + Pilot-Box → Quiz → Ergebnisse → Was Ihre Kanzlei bekommt → Über mich (`about`, Foto aus `public/team/`) → Für wen → Pilotangebot + Garantie → FAQ → Abschluss-CTA → Footer
- `https://elevo.solutions/familienrecht/danke/`: Danke-Seite mit „Nummer speichern“ (`.vcf`), hier und nur hier lädt der Meta Pixel
- Beide Seiten sind `noindex` und stehen nicht in der Sitemap (nur Ads-Traffic).
- Kein Video: Headline, Pilot-Box und direkt darunter das Quiz.

**Alle Texte, Fragen, IDs und Links stehen in `src/config/familienrecht.json`.** Die Komponenten (`src/familienrecht/components/`) lesen nur aus dieser Datei.

---

## 1. Texte ändern

`src/config/familienrecht.json` bearbeiten, committen, pushen → Coolify baut neu.

- Fett im Text: `**so**` (z. B. in `pilot.bullets`).
- `{{free}}` / `{{total}}` werden durch die freien bzw. alle Pilotplätze ersetzt.

### Offene Platzhalter prüfen

```bash
bun run check:placeholders
```

Listet alle `[…]`- und `[NEED: …]`-Texte, leere IDs (`formGuid`, `metaPixelId`) und fehlende Dateien. Exit-Code 1, solange etwas offen ist. Dieselbe Liste erscheint beim `bun run build` als Warnung.

## 2. Nach einem Close: freie Plätze senken

Die Zahl der freien Plätze ändert sich **nie automatisch** (kein Zähler, keine HubSpot-Anbindung). Nach jedem unterschriebenen Vertrag:

1. In `src/config/familienrecht.json` `pilot.freePlaces` um 1 senken.
2. Committen und pushen → Coolify deployt.

Bei `"freePlaces": 0` zeigt die Pilot-Box „Alle 5 Pilotplätze vergeben“ und der Abschluss-CTA die Warteliste.

## 3. Headline-Test A/B/C

- `?h=a`, `?h=b`, `?h=c` wählt die H1 aus `hero.headlines`, ohne Parameter gilt `hero.defaultVariant`.
- Die Variante wird für die Sitzung gemerkt und als `lp_headline` an HubSpot gesendet.
- In Meta dieselben Anzeigen mit drei Ziel-URLs anlegen, z. B. `https://elevo.solutions/familienrecht/?h=b`.
- Entscheiden erst ab ca. 30 Leads pro Variante.

## 4. Quiz und Lead-Qualifizierung

12 Schritte, eine Frage pro Bildschirm. Die 10 Auswahlfragen sind per Klick beantwortet, danach Name/Kanzlei/Website und Kontakt.

| # | Frage | HubSpot-Property |
| --- | --- | --- |
| 1 | Anteil Familienrecht an den Mandaten | `lead_schwerpunkt` |
| 2 | Anwälte im Familienrecht | `lead_kanzlei_groesse` |
| 3 | Kapazität für zusätzliche Mandate pro Monat | `lead_kapazitaet` |
| 4 | Woher neue Mandate heute kommen | `lead_akquise` |
| 5 | Honorar pro Familienrechtsmandat | `lead_mandatswert` |
| 6 | Wer ruft zurück und wie schnell | `fr_rueckruf` |
| 7 | Wo Anfragen erfasst werden (CRM, Kanzleisoftware, …) | `lead_crm` |
| 8 | Monatliches Werbebudget | `fr_werbebudget` |
| 9 | Wer entscheidet | `lead_entscheider` |
| 10 | Startzeitpunkt | `lead_startzeitpunkt` |
| 11 | Vorname*, Nachname, Kanzlei, Website | `firstname`, `lastname`, `company`, `website` |
| 12 | Telefon*, E-Mail*, Einwilligung* | `phone`, `email` |

Fragen und Antworten ändern: `form.steps`. Eine Frage hinzufügen = neuen Schritt mit `"type": "choice"` eintragen und die Property in HubSpot anlegen.

**Kein harter Ausschluss:** Jede Anfrage wird gesendet. Stattdessen berechnet die Seite eine Priorität für den Setting-Call und sendet sie als `lp_prioritaet`:

- **C – passt eher nicht**: mindestens eine Antwort aus `red` (z. B. Werbebudget unter 1.000 €, Rückruf erst nach 1–2 Tagen, keine Kapazität, entscheidet nicht selbst, Start „Später“).
- **A – sehr gut qualifiziert**: keine `red`-Antwort und mindestens `form.priority.aMinGreen` (4) Antworten aus `green`.
- **B – prüfen**: alles dazwischen.

`red` und `green` stehen bei jeder Frage in `form.steps` und lassen sich dort anpassen. In HubSpot nach `lp_prioritaet` sortieren und A-Leads zuerst anrufen.

Verhalten: Klick auf eine Kachel springt nach 250 ms weiter, Zurück behält die Antworten, Antworten überleben ein Neuladen (sessionStorage) und werden nach erfolgreichem Versand gelöscht. Ohne JavaScript stehen alle Fragen untereinander und das Formular geht an den HubSpot-Legacy-Endpunkt (`forms.hubspot.com/uploads/form/v2/…`) mit Weiterleitung auf die Danke-Seite.

## 5. HubSpot einrichten (einmalig)

1. **Kontakt-Properties** anlegen (Einstellungen → Properties → Kontakt), Typ „Einzeiliger Text“ (oder Dropdown mit exakt denselben Werten wie die `options`):
   `lead_schwerpunkt`, `lead_kanzlei_groesse`, `lead_kapazitaet`, `lead_akquise`, `lead_mandatswert`, `fr_rueckruf`, `lead_crm`, `fr_werbebudget`, `lead_entscheider`, `lead_startzeitpunkt`, `lp_prioritaet`, `lp_variante`, `lp_headline`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`
2. **Formular anlegen** mit **allen** Feldern (wichtig: die Forms API verwirft jedes Feld, das nicht im Formular steht, auch wenn die Property existiert): Vorname, Nachname, E-Mail, Telefon, Firma, Website und alle Properties aus Schritt 1 (die UTM-Felder, `fbclid`, `lp_*` als ausgeblendete Felder). Die API verwirft Felder, die nicht im Formular sind.
3. `formGuid` in `form.hubspot.formGuid` eintragen (`portalId` 149380660 ist gesetzt).
4. **Push aufs Handy**: in der HubSpot-App Benachrichtigungen für Formulareinsendungen aktivieren.

## 6. Tracking und Einwilligung

- Auf `/familienrecht/` lädt **kein** Pixel und kein anderes Tracking.
- Nach erfolgreichem Versand: `lead_submitted`, `lead_vorname`, `lead_event_id` im sessionStorage, Weiterleitung auf `/familienrecht/danke/`.
- Dort lädt der Pixel nur mit Pixel-ID (`tracking.metaPixelId`), Marketing-Einwilligung und Versand vor höchstens 30 Minuten: `init` → `PageView` → `Lead` mit `eventID`. Neuladen zählt keinen zweiten Lead.
- Ohne `metaPixelId` lädt nichts. Für das bestehende Werbekonto kann dieselbe Pixel-ID wie in `src/config/site.json` eingetragen werden.
- Die Einwilligung wird mit dem Rest von elevo.solutions geteilt (`elevo_consent_v2`).

## 7. Lokal starten und deployen

```bash
bun install
bun run dev      # http://localhost:4321/familienrecht/
bun run build
```

Deploy wie die restliche Website über Coolify (Dockerfile → nginx). Ziel-URL in Meta: `https://elevo.solutions/familienrecht/` (mit Schrägstrich). Eine eigene Subdomain wie `start.elevo.solutions` wäre zusätzlich in Coolify/Cloudflare einzurichten.

## Projektstruktur

```
src/config/familienrecht.json        alle Texte, Fragen, IDs, Links
src/pages/familienrecht/index.astro  Landingpage
src/pages/familienrecht/danke.astro  Danke-Seite
src/pages/familienrecht/mert-efe-celik.vcf.ts  vCard für „Nummer speichern“
src/familienrecht/
  components/  Hero, PilotBox, QuizForm, Results, HowItWorks, About, Fit, Offer, Faq, FinalCta, StickyCta, ConsentBanner, Footer
  lib/         variant.ts (A/B/C), vcard.ts, answers.ts (Quiz-Zwischenstand)
  layouts/FrLayout.astro, styles/global.css (Tailwind nur für diese Seiten)
public/familienrecht/                Referenz-Logos (Greenchild, BrandsMarketingLab)
scripts/check-placeholders.mjs       Prüfung offener Platzhalter
```

HubSpot-Versand, UTM, Einwilligung und Pixel nutzen dieselben Bausteine wie /neukundensystem (`src/neukundensystem/lib/`).
