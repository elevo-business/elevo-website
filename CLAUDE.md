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
  components/   Hero, Header, Footer, ContactForm (.astro)
  layouts/      BaseLayout.astro (SEO meta, OG tags, fonts)
  pages/        index, leistungen, referenzen, kontakt, impressum, datenschutz
    previews/   Kunden-Preview-Seiten (Einzelseiten pro Kunde)
    demos/      Demo-Websites
  styles/       global.css (CSS Custom Properties, keine Frameworks)
public/         Fonts (Sora, Outfit woff2), Icons, Bilder
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
- Kundenvorschauen unter /previews/ nutzen das Template-System (siehe unten)
- Nginx cached statische Assets 1 Jahr (immutable) — Cache-Busting bei Asset-Änderungen
- Kein Light-Mode — Website ist ausschliesslich Dark Theme
- Keine Frameworks (Tailwind/SCSS/React) installieren — Pure CSS + Astro only

## Template-System: Neue Preview erstellen

Preview-Seiten unter `src/pages/previews/` nutzen das wiederverwendbare Template-System.

### Architektur

```
src/templates/
  config/
    types.ts          BranchProfile, ProspectData, ColorScheme, SectionConfig
    galabau.ts        Branchenprofil GaLaBau (Grün, Natur)
    handwerk.ts       Branchenprofil Handwerk (Blau, Vertrauen)
    makler.ts         Branchenprofil Immobilien (Gold, Premium)
    kuechen.ts        Branchenprofil Küche/Interior (Amber, Lifestyle)
  layouts/
    PreviewLayout.astro   Basis-Layout: Fonts, CSS-Vars, Meta, ELEVO-Dot
  sections/
    PreviewNav.astro       Navigation mit Logo, Links, CTA
    PreviewHero.astro      Hero mit Badge, Titel, Untertitel, Stats, Bild
    PreviewServices.astro  Leistungskarten (3-spaltig)
    PreviewStats.astro     Kennzahlen (cards oder bar)
    PreviewGallery.astro   Bildergalerie (grid, masonry, beforeAfter)
    PreviewTestimonials.astro  Kundenstimmen
    PreviewCTA.astro       Call-to-Action Block
    PreviewFooter.astro    Footer mit Spalten
public/templates/themes/
    galabau.css, handwerk.css, makler.css, kuechen.css
```

### Schritt-für-Schritt: Neue Preview anlegen

**1. Datei anlegen** — `src/pages/previews/<prospect-slug>.astro`

**2. Imports**
```astro
---
import PreviewLayout from '../../templates/layouts/PreviewLayout.astro';
import { galabauProfile } from '../../templates/config/galabau'; // Branche wählen
import PreviewNav from '../../templates/sections/PreviewNav.astro';
import PreviewHero from '../../templates/sections/PreviewHero.astro';
import PreviewServices from '../../templates/sections/PreviewServices.astro';
import PreviewCTA from '../../templates/sections/PreviewCTA.astro';
import PreviewFooter from '../../templates/sections/PreviewFooter.astro';
import type { ProspectData } from '../../templates/config/types';
```

**3. ProspectData definieren** — enthält alle Inhalte des Prospects:
```ts
const prospect: ProspectData = {
  name: 'Firmenname GmbH',
  tagline: 'Kurzer Slogan',
  location: 'Stadt',
  email: 'info@firma.de',
  phone: '+49 ...',
  heroTitle: 'Hauptüberschrift der Hero-Section.',
  heroSubtitle: 'Ein oder zwei Sätze für Meta-Description und Hero-Text.',
  services: [
    { icon: 'grid', title: 'Leistung 1', description: 'Beschreibung...' },
    // weitere Services...
  ],
  stats: [
    { value: '20+', label: 'Jahre Erfahrung' },
  ],
};
```

**4. Layout und Sections rendern**
```astro
---
<PreviewLayout profile={galabauProfile} prospect={prospect}>
  <PreviewNav prospectName={prospect.name} ctaText="Anfragen" ctaHref="#kontakt" />
  <PreviewHero title={prospect.heroTitle} subtitle={prospect.heroSubtitle} stats={prospect.stats} />
  <PreviewServices title="Unsere Leistungen" services={prospect.services} />
  <PreviewCTA title="Bereit?" subtitle="Unverbindlich anfragen." />
  <PreviewFooter prospectName={prospect.name} email={prospect.email} year={2025} />
</PreviewLayout>
```

**5. Build prüfen** — `bun run build` muss fehlerfrei laufen.

### Welche Daten braucht man pro Prospect?

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| `name` | ✅ | Offizieller Firmenname |
| `heroTitle` | ✅ | Hauptüberschrift (1–2 Zeilen) |
| `heroSubtitle` | ✅ | Kurze Beschreibung (Meta-Description + Hero) |
| `location` | ✅ | Stadt / Region |
| `services` | ✅ | Mind. 3, max. 6 Leistungen mit icon/title/description |
| `tagline` | — | Optionaler Slogan für den Browser-Titel |
| `email` | — | Kontakt-E-Mail |
| `phone` | — | Telefonnummer für CTA |
| `stats` | — | 2–4 Kennzahlen (value + label) |
| `logo` | — | Pfad zum Logo (OG-Image, Nav) |
| `galleryImages` | — | Array von { src, alt, beforeSrc? } |
| `testimonials` | — | Array von { text, author, role?, rating? } |

### Branchenprofil wählen

| Branche | Import | Farbe |
|---------|--------|-------|
| GaLaBau / Gartenbau | `galabauProfile` | Grün #16A34A |
| Handwerk (Maler, SHK) | `handwerkProfile` | Blau #2563EB |
| Makler / Immobilien | `maklerProfile` | Gold #C9A84C |
| Küche / Interior | `kuechenProfile` | Amber #D97706 |

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
