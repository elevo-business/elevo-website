# Elevo — elevo-astro

> **Branding-Hinweis:** Logo und Marken-Wortmarke ist **Elevo** (ein Wort, keine Lücke, kein „ELE VO"/„Ele Vo"). Der rechtliche Entity-Name in Impressum/Datenschutz/Schema.org bleibt „ELEVO Solutions" (Einzelunternehmen). Für Title-Tags, OG-Tags und sichtbaren Text der Marketing-Seiten: **Elevo** verwenden.

## Setup
- Runtime: Bun (>=22.12.0 Node compat)
- Build: `bun run build` (Astro 6 static output)
- Dev: `bun run dev`
- Preview: `bun run preview`
- Deploy: Docker (bun builder + nginx:alpine), Coolify auf Netcup

## Architektur

```
src/
  components/   Header, Footer, Logo, ContactForm, CookieBanner (.astro)
    legal/      ImpressumContent, DatenschutzContent
  layouts/      BaseLayout.astro (SEO meta, OG tags, Fonts, Consent/Tracking)
  pages/        index, leistungen, kontakt, impressum, datenschutz
  styles/       global.css (Design System v2 „Pipeline": CSS Custom Properties, keine Frameworks)
public/         Fonts (Sora, Outfit woff2), Icons, Fotos (fulfillment/, team/), og-image.jpg
```
## Brand CI (zwingend, Visual Direction v1 — Ink/Teal, ab ELE-600/ELE-597)
- Akzent: `--accent: #3DD6C0` (Teal) — Hover: `#2EBFAB`
- Hintergrund: `--bg-deep: #08111B` / `--bg-dark: #0D1B2A` (Ink) / `--bg-card: #14253A` (Surface 1)
- Text: `--text-primary: #FFFFFF` / `--text-secondary: #C9D7E4` / `--text-muted: #8AAFC8`
- Border: `--border: #243A55` / `--border-strong: rgba(61,214,192,0.35)`
- Headings: Sora (mit Inter-Fallback), 400–800. Body: Outfit (mit Inter-Fallback), 300–600.
- Alle Fonts self-hosted (DSGVO)
- Border-Radius: `--radius: 14px`
- Transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Logo-Komponente: `src/components/Logo.astro` (wordmark „Elevo" + Echo-Chevron-Icon)

## Konventionen
- Sprache Website: Deutsch (de)
- Astro-Komponenten: PascalCase, `.astro` Endung
- Styling: CSS Custom Properties aus global.css, kein Tailwind/SCSS
- Seiten: Kebab-case Dateinamen
- Bilder: WebP bevorzugt, lazy loading
- SEO: Jede Seite braucht title, description, canonical, OG tags

## Frontend Rules
- Nur Astro-Komponenten (.astro), kein React/Vue/Svelte
- Neue Farben/Variablen IMMER als CSS Custom Property in :root definieren
- Responsive: Mobile-first, Breakpoints bei 768px und 1024px
- Accessibility: Semantisches HTML, ARIA-Labels, Skip-Links beibehalten
- Bilder: WebP, loading="lazy", width/height Attribute setzen
- Animations: CSS-only mit var(--transition), kein JS für Hover/Fade

## SEO Rules
- Jede Seite MUSS: einzigartigen title, meta description, canonical URL, OG tags haben
- Title-Format: "Seitenname — Elevo" (Wortmarke; rechtliche Texte dürfen weiterhin „ELEVO Solutions" nennen)
- Strukturierte Daten: Schema.org LocalBusiness für Hauptseiten
- Sitemap automatisch via @astrojs/sitemap
- Alt-Texte für alle Bilder (deutsch, beschreibend)

## Deployment Rules
- `bun run build` muss fehlerfrei durchlaufen vor jedem Commit
- Docker: Multi-stage (bun builder → nginx:alpine), keine Runtime-Dependencies
- Site-URL `https://elevo.solutions` in astro.config.mjs NICHT ändern
- Output IMMER `static` — kein SSR aktivieren
- Hosting: Coolify auf Netcup — keine anderen Provider ohne Board-Freigabe
- **Pflicht-Gate**: Bei sichtbaren Marketing-Änderungen erst Staging (`relaunch.elevo.solutions` o.ä.) deployen, CEO Live-Look anfragen, dann Cut-over auf elevo.solutions.
- **Preise**: Auf den sichtbaren Marketing-Seiten (`index.astro`, `leistungen.astro`, FAQ) dürfen KEINE EUR-Beträge/Preisranges stehen — Soft-CTA „Strategie-Gespräch" statt Preisanker (Hormozi-Style).

## Gotchas
- Fonts NICHT von Google CDN laden (DSGVO-Verstoss)
- Nginx cached statische Assets 1 Jahr (immutable) — Cache-Busting bei Asset-Änderungen
- Kein Light-Mode — Website ist ausschliesslich Dark Theme
- Keine Frameworks (Tailwind/SCSS/React) installieren — Pure CSS + Astro only

## Skills

### /brand-audit
Automatisierte ELEVO Brand-CI Prüfung gegen Corporate Identity Regeln.

Beim Aufruf von `/brand-audit` prüft der Skill:
- **Farben**: Hardcoded Hex-Werte ausserhalb CI? CSS Custom Properties korrekt genutzt?
- **Fonts**: Self-hosted? Kein Google CDN? Sora/Outfit vorhanden?
- **Sprache & Ton**: Keine externen Tool-Namen, "Wir"-Form, kein englischer Placeholder-Text

Implementierung: `.claude/skills/brand-audit/`
Referenz: `.claude/skills/brand-audit/resources/brand-reference.md`

### /deploy-check
Pre-Deployment Checkliste — Build, SEO, Assets, Brand-CI vor jedem Deployment.

Implementierung: `.claude/skills/deploy-check/`
