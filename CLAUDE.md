# CLAUDE.md — ELEVO Website Relaunch

> Kontext-Datei für Claude Code. Wird automatisch gelesen bei jedem `claude` Start.

---

## Projekt

- **Kunde:** ELEVO (eigene Website)
- **Ziel:** Voll-Relaunch von Single-Page zu Multi-Page (10 Seiten + Blog)
- **Live-Domain:** elevo.solutions
- **Qualitäts-Benchmark:** https://greenchild-preview.elevo.solutions/de/

---

## Tech-Stack

- **Architektur:** 10 individuelle HTML-Dateien + 1 shared CSS + 1 shared JS
- **Keine Frameworks:** Kein Astro, kein React, kein Tailwind, kein Bootstrap, kein jQuery
- **Fonts:** Google Fonts via `<link>` — Sora (Headlines) + Outfit (Body)
- **Icons:** Lucide via unpkg CDN
- **Formulare:** Eigene API — `https://api.elevo.solutions/api/contact` → Pipedrive
- **Tracking:** Google Ads gtag (AW-18023151518), Consent Mode v2
- **Bilder:** WebP bevorzugt, JPG Fallback. Lazy Loading ab Fold. Unsplash/Pexels für Stock.

### Dateistruktur

```
elevo-website/
├── index.html                          Startseite
├── leistungen/
│   ├── websites.html                   Service: Websites
│   ├── prozessdigitalisierung.html     Service: Prozesse
│   └── seo-und-ads.html               Service: SEO & Ads
├── referenzen/
│   ├── greenchild.html                 Case Study: Greenchild
│   ├── akropolis.html                  Case Study: Akropolis
│   ├── zuma-lounge.html                Case Study: ZUMA
│   └── it-vertrieb.html               Case Study: IT-Vertrieb
├── audit.html                          Lead-Magnet Landing
├── kontakt.html                        Kontakt + FAQ
├── ueber-uns.html                      Über ELEVO
├── prozess.html                        So arbeiten wir
├── blog/
│   └── index.html                      Blog-Übersicht
├── css/
│   └── style.css                       Shared Stylesheet (alle Seiten)
├── js/
│   └── main.js                         Shared JavaScript (alle Seiten)
├── assets/
│   └── img/                            Bilder
├── sitemap.xml                         SEO Sitemap
├── robots.txt                          Crawler-Steuerung
└── favicon.svg                         Favicon
```

### Shared CSS + JS

- **style.css** wird von JEDER Seite per `<link>` eingebunden — kein Inline-CSS
- **main.js** wird von JEDER Seite per `<script src>` eingebunden — kein Inline-JS
- Seitenspezifisches CSS/JS nur wenn nötig als kleiner `<style>`/`<script>` Block
- CSS Custom Properties (`:root`) für ALLE Farben, Fonts, Spacing

### Header + Footer (identisch auf allen Seiten)

**Header-Nav:**
```
Logo | Leistungen (Dropdown) | Referenzen (Dropdown) | Über uns | Blog | Erstgespräch buchen (CTA)
```

**Leistungen-Dropdown:** Websites, Prozessdigitalisierung, SEO & Ads
**Referenzen-Dropdown:** Greenchild, Akropolis, ZUMA Lounge, IT-Vertrieb

**Footer:** Logo + Tagline, Leistungen-Links, Referenzen-Links, Kontakt, Impressum/Datenschutz (Overlays), Copyright

---

## Design-System

### Farbpalette (Dark Theme — ELEVO CI)

```css
:root {
  --bg: #05070E;
  --bg-elevated: #0A0E1A;
  --surface: #111827;
  --surface-hover: #1A2035;
  --border: #1E2A42;
  --text: #E2E8F0;
  --text-muted: #8899B0;
  --text-dim: #516179;
  --accent: #3B82F6;
  --accent-hover: #2563EB;
  --accent-glow: rgba(59,130,246,.15);
  --accent-soft: rgba(59,130,246,.06);
  --accent2: #818CF8;
  --green: #10B981;
  --orange: #F59E0B;
}
```

### Typografie

- Headlines: Sora 700, letter-spacing -0.02em
- Body: Outfit 300, line-height 1.7, 15.5px / 14.5px Mobile
- Labels: Uppercase, letter-spacing 0.16em, 600, 11px
- H1: clamp(34px, 5.5vw, 56px) | H2: clamp(28px, 3.8vw, 42px)

### Design-Richtung

- **Ruhiger als aktuelle Seite** — Content-Fokus, nicht Effekt-Fokus
- Benchmark: Greenchild-Niveau (clean, premium, content-driven)
- Mobile-first. Breakpoints: 900px (Tablet), 600px (Mobile)

### Erlaubte Effekte (sparsam)

- Scroll Reveal (opacity + translateY)
- Staggered Delays
- Animated Counters (nur bei Cases)
- Scroll Progress Bar

### Verbotene Effekte

- ~~Floating Orbs~~ | ~~Mouse-Glow~~ | ~~Film-Grain~~ | ~~3D Tilt~~ | ~~Floating Geometry~~

---

## SEO — KRITISCH

### Pro Seite PFLICHT

1. Unique `<title>` mit Keyword vorne: `[Keyword] — ELEVO`
2. Unique `<meta name="description">` — 150-160 Zeichen
3. Genau 1x H1, dann H2 → H3. Kein Sprung.
4. Breadcrumbs mit Schema.org BreadcrumbList (JSON-LD)
5. Canonical: `<link rel="canonical" href="https://elevo.solutions/[pfad]">`
6. OG Tags: title, description, image, url, type
7. Min. 2 interne Links zu anderen ELEVO-Seiten
8. Schema.org: ProfessionalService (Startseite), FAQPage (wo FAQ), BreadcrumbList (überall)
9. Alt-Tags auf allen Bildern (beschreibend + keyword)
10. Lighthouse Mobile ≥ 95

### Keyword-Zuweisung

| Seite | Primäres Keyword |
|-------|-----------------|
| `/` | webagentur aachen |
| `/leistungen/websites` | website erstellen lassen aachen |
| `/leistungen/prozessdigitalisierung` | prozessdigitalisierung kmu |
| `/leistungen/seo-und-ads` | seo agentur aachen |
| `/referenzen/greenchild` | website investment plattform |
| `/referenzen/akropolis` | website restaurant |
| `/referenzen/zuma-lounge` | website shisha lounge |
| `/referenzen/it-vertrieb` | prozessdigitalisierung beispiel |
| `/audit` | website audit kostenlos |
| `/kontakt` | elevo kontakt |

---

## Signature Features

### 1. Digital-Check Quiz (Startseite)

- 5 Fragen: Branche, Website-Status, größtes Problem, Ziel, Budget-Range
- 1 Frage pro Screen, Cards zum Klicken, Progress-Bar
- Output: Stufen-Empfehlung (1/2/3) + passende Referenz + CTA zum Audit
- Reines HTML/CSS/JS, kein Backend

### 2. Audit-Landing (/audit.html)

- KEIN automatisches Tool — Premium-Landing mit Formular
- User bekommt: Loom-Video + 2-Seiten-PDF (manuell erstellt, in 48h)
- Formular: Firma, Name, E-Mail, Website-URL, Branche
- Endpoint: api.elevo.solutions/api/contact (topic: "Website-Audit")

---

## Content-Regeln

- Du-Ansprache, immer
- Wir statt Ich
- Seriös aber menschlich
- VERBOTEN: "Herzlich willkommen", "junges dynamisches Team", "Qualität ist uns wichtig", Toolnamen, Sie-Ansprache
- Headlines sprechen Endkunden an (KMU-Geschäftsführer mit digitalem Schmerz)

### Referenz-Cases — Struktur pro Seite

1. Problem — Was war vorher?
2. Lösung — Was hat ELEVO gebaut? (technisch spezifisch)
3. Ergebnis — Messbar oder qualitativ
4. Screenshots — Desktop + Mobile
5. Signature Feature Highlight
6. CTA — "Willst du ähnliche Ergebnisse?"

---

## Headline-Safety — NICHT VERHANDELBAR

```css
h1, h2, h3, h4, h5, h6,
[class*="title"], [class*="heading"] {
    word-spacing: normal !important;
    white-space: normal;
    overflow-wrap: break-word;
    text-rendering: optimizeLegibility;
}
.word-reveal span {
    display: inline-block;
    margin-right: 0.25em;
}
.word-reveal span:last-child {
    margin-right: 0;
}
```

---

## Hosting & Deployment

- **Repo:** github.com/elevo-business/elevo-website
- **Server:** Netcup VPS 159.195.37.216
- **Coolify:** Build Pack = Static
- **DNS:** Cloudflare
- **Nach Push:** Coolify Auto-Build → Cloudflare Cache purgen → Incognito testen

---

## Rechtliches

- Impressum + Datenschutz als Overlay-Popups
- Cookie-Banner bei Tracking
- Consent in localStorage
- KEIN Web3Forms — eigene API (api.elevo.solutions)

---

## Logo

SVG inline: Doppel-Chevron im Kreisring.
- Header: 36×36px Icon, 16px Wortmarke
- Footer: 28×28px Icon, 13px Wortmarke
- V in ELEVO = #3B82F6
- Favicon: favicon.svg (vereinfacht)

---

## Qualitäts-Check (JEDE Seite vor Deploy)

- [ ] Lighthouse Mobile ≥ 95, SEO = 100
- [ ] H1 genau 1x, Title + Meta unique
- [ ] Canonical + OG Tags + Schema.org valid
- [ ] Breadcrumbs vorhanden
- [ ] Min. 2 interne Links
- [ ] Bilder: alt-Tags, lazy, komprimiert
- [ ] Headlines: Keine zusammengeschriebenen Wörter
- [ ] Mobile 375px getestet
- [ ] Formular funktioniert
- [ ] Legal-Overlays + Cookie-Banner funktionieren
- [ ] Nav-Links alle korrekt
