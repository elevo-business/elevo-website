# ELEVO Brand-CI Referenz

Dieses Dokument ist die verbindliche Referenz für alle ELEVO Corporate Identity Regeln.
Es wird vom `/brand-audit` Skill verwendet.

---

## 1. Farbpalette

| CSS Custom Property | Hex-Wert | Verwendung |
|---------------------|----------|------------|
| `--accent` | `#3B82F6` | Primärfarbe, CTAs, Highlights (Blue 500) |
| `--bg-deep` | `#05070E` | Tiefster Hintergrund (Hero, Body-BG) |
| `--bg-dark` | `#0A0E1A` | Abschnitt-Hintergrund |
| `--text-primary` | `#E2E8F0` | Haupttext |
| `--text-secondary` | `#94A3B8` | Sekundärtext, Captions |
| `--border` | `rgba(255,255,255,0.08)` | Karten-Borders |

### Regeln
- Hardcoded Hex-Werte ausserhalb von `global.css` → ❌ Verstoß
- Farben immer als `var(--accent)` etc. referenzieren → ✅ korrekt
- Abweichende Blautöne / Grautöne ohne CI-Grundlage → ❌ Verstoß
- Hartes `#000000` als Hintergrund (statt `--bg-deep`) → ❌ Verstoß

### Erlaubte Ausnahmen
- `src/styles/global.css` → `:root`-Definitionen sind erlaubt
- `public/templates/themes/*.css` → Branchen-Themes haben eigene Farbpaletten

---

## 2. Typografie

| Font | Verwendung | Weights | Quelle |
|------|-----------|---------|--------|
| **Sora** | Headings (h1–h6) | 400, 500, 600, 700, 800 | self-hosted `public/fonts/` |
| **Outfit** | Body, UI-Elemente | 300, 400, 500, 600 | self-hosted `public/fonts/` |

### Regeln
- Google Fonts CDN (`fonts.googleapis.com`) → ❌ DSGVO-Verstoß, sofort beheben
- Fonts nicht in `public/` vorhanden → ❌ Verstoß
- Andere Fonts ohne Board-Freigabe → ❌ Verstoß
- `font-display: swap` empfohlen → ⚠️ Warnung wenn fehlend

---

## 3. Spacing & Radius

| Eigenschaft | Wert | Verwendung |
|-------------|------|------------|
| Border-Radius small | `12px` | Karten, Inputs, Buttons |
| Border-Radius large | `20px` | Hero-Cards, Feature-Boxes |
| Standard-Transition | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Alle Hover-States |
| Section-Padding | `80px–120px` vertikal | Desktop |
| Container-Max-Width | `1200px` | Hauptlayout |

### Regeln
- Andere Radius-Werte ohne Begründung → ⚠️ Warnung
- Abgehackte Transitions (kein Cubic-Bezier) → ⚠️ Warnung
- Fehlende Hover-States bei interaktiven Elementen → ❌ Verstoß

---

## 4. Dark-Only

ELEVO ist ausschliesslich Dark Theme. Es gibt keinen Light Mode.

### Verbotenes
- `prefers-color-scheme: light` Media-Queries → ❌ Verstoß
- Helle Hintergründe (`background: white`, `background: #fff`) → ❌ Verstoß
- Klassen wie `.light-mode`, `.light_theme` → ❌ Verstoß
- Harte schwarze Texte auf weissem Grund → ❌ Verstoß

---

## 5. Sprache & Ton

### Website-Sprache
- Alle kundenvisiblen Texte: **Deutsch** (de)
- Lang-Attribut: `<html lang="de">`
- Keine englischen Placeholder oder Dummy-Texte

### Ansprache
- Immer "**Wir**", nie "Ich" → Agentur-Ansprache
- Beispiel: "Wir entwickeln..." statt "Ich entwickle..."
- Höfliche Du/Sie-Ansprache an Kunden je nach Kontext

### Verbotene Begriffe (kundenvisibel)
| Begriff | Kategorie |
|---------|-----------|
| Coolify | Hosting-Tool |
| Zapier | Automatisierung |
| Paperclip | Internes Tool |
| Netcup | Hosting-Provider |
| Anthropic | KI-Anbieter |
| Claude | KI-Modell |
| ChatGPT / OpenAI | KI-Modell |
| Hetzner | Server-Provider |

---

## 6. Assets & Performance

### Bilder
- Format: **WebP** bevorzugt
- `loading="lazy"` auf alle Bilder ausserhalb des Viewports
- `width` und `height` Attribute setzen (Layout Shift verhindern)
- `alt`-Attribute: deutsch, beschreibend

### Icons
- SVG bevorzugt
- Inline-SVG für interaktive Icons (kein externes CDN)

---

## 7. Code-Qualität

### CSS
- Keine Inline-Styles
- Kein `!important`-Spam
- CSS Custom Properties aus `global.css` nutzen
- Mobile-First, Breakpoints: `768px` (Tablet) und `1024px` (Desktop)

### HTML
- Semantisches HTML (h1→h2→h3, keine Sprünge)
- ARIA-Labels für Icons ohne Text
- Skip-Links vorhanden

---

## 8. SEO-Pflicht

Jede Seite MUSS haben:
- Einzigartiger `<title>`: Format "Seitenname — ELEVO | Webagentur Aachen"
- `<meta name="description">` (150–160 Zeichen)
- `<link rel="canonical">`
- Open-Graph Tags (`og:title`, `og:description`, `og:image`)

---

*Quelle: `elevo-astro/CLAUDE.md` — Abschnitt "Brand CI (zwingend)"*
