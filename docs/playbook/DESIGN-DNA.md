# DESIGN-DNA — Elevo (v2, From-Scratch-Build nach Playbook §2)

> Neuer Ansatz. Eigenständiges Design — **kein** Re-Skin des alten Cremeweiß-Themes,
> **keine** Kopie der Referenz (Scribble: hell, Serif/Fraunces, Index-Numerals + §).
> Divergenz-Engine durchlaufen; Distanz-Check unten.

## Achsen
- **Typo-System:** Grotesk-Display (**Sora**, sehr groß, eng) + Grotesk-Text (**Outfit**) + **Monospace-Akzent** (System-Mono) für Eyebrows, Stufen-Indizes und Kennzahlen. → technisch-präzise, selbstbewusst. *(Scribble = Serif-Display → bewusst anders.)*
- **Farbstrategie:** **Dark-first Ink + Teal-Glow.** `--bg-deep #070D16`, `--bg-card #111E30`, Akzent Teal `#3DD6C0`. → entspricht der dokumentierten Marken-CI (CLAUDE.md „Ink/Teal"), die nie umgesetzt war. *(Scribble = helles Papier; aktuelle Live-Seite = Creme-hell → bewusst anders.)*
- **Layout-Archetyp:** Asymmetrisch, **links-bündiger** Editorial-Grid mit überdimensionierter Display-Typo. *(Kein zentrierter „KI-Default"-Hero.)*
- **SIGNATURE-DEVICE (genau eines):** **„Die Wachstumstreppe"** — ein aufsteigendes Stufen-/Treppen-Motiv. Die 3 Stufen (Fundament · Autorität · Skalierung) sitzen sichtbar auf **ansteigenden Stufen**; eine aufsteigende Linie verbindet sie und zieht sich als Leitmotiv durch Hero, Mechanismus und Sektions-Übergänge. Mono-Indizes `01 02 03`. → ownable, direkt aus der Hormozi-Stufen-Positionierung abgeleitet. *(Scribble nutzt Index-Numerals + §-Marginalien → bewusst anders.)*
- **Bewegung:** zurückhaltend (Reveal); die Treppen-Linie „wächst" beim Scrollen. Reduced-Motion- + No-JS-sicher.
- **Bildwelt:** typografisch + Treppen-Motiv + echte Magazin-Cover + Live-iFrames der Referenzen. Kein Stock.
- **Dichte:** strukturiert, großzügig; editoriale Verdichtung in Stat-/Proof-Blöcken.
- **Voice:** selbstbewusst · klar · hochwertig (Hormozi-direkt).

## Distanz-Check vs. Referenz (Scribble) — ≥3 Achsen anders ✓
1. Typo: Grotesk+Mono ↔ Serif (Fraunces)
2. Farbe: Dark Ink/Teal ↔ helles Papier
3. Signature: aufsteigende Treppe ↔ Index-Numerals + §
4. Layout-Detail: Stufen-Motiv statt Marginalien

## Anti-„KI-gebaut" (§7)
Kein zentrierter Hero mit zwei Pill-Buttons + 3 gleiche Icon-Karten. Stattdessen:
links-bündige Riesen-Typo, Mono-Labels, **ein** konsequentes Signature-Device,
ungleiche/ansteigende Karten, echte Kennzahl (25 Leads) statt Floskel.

## SEO-Lehren aus der Referenz (übernommen, nicht das Design)
- `geo.region`/`geo.placename`-Meta, `og:image:width/height`, Canonical.
- JSON-LD-Graph: ProfessionalService + **WebSite** + **BreadcrumbList** + **FAQPage**.
- FAQ-Überschriften = echte Suchsätze; Sitemap via `@astrojs/sitemap`.
