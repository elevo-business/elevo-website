# DESIGN-DNA — Elevo (Flagship „Editorial-Magazin")

> Maximal hochwertiger Eigenauftritt nach WEBSITEQUALITYPLAYBOOK §2.
> Ziel: nicht als „mit-KI-gebaut" erkennbar; Niveau von Award-/Studio-Sites.
> Bewusst divergent von der Referenz (Scribble: hell, Serif, Index-Numerals + §)
> und vom früheren hellen Baukasten-Theme.

## Achsen
- **Typo-System:** **Instrument Serif** (self-hosted, latin reg+italic) als überdimensionierte Editorial-Display-Schrift, **Outfit** für Lauftext, **System-Monospace** für Folios/Labels/Kennzahlen-Captions. Hoher Stil-Kontrast Serif↔Mono = Magazin-Anmutung.
- **Farbstrategie:** **Warmes Papier** (`#F7F3EA`) + tiefes **Ink** (`#17130C`) + **ein** sattes Akzent-**Vermilion** (`#D8431F`). Kein Tech-Blau, kein Verlauf-Blob. Editorial, warm, teuer.
- **Layout-Archetyp:** Asymmetrischer Editorial-Grid, **Hairlines statt Boxen** (keine „3 Icon-Karten"), großzügige Margins, bleedende Riesen-Serif, Margin-Numerale.
- **SIGNATURE-DEVICE (genau eines):** **„Der Faden"** — eine fixe vermillionfarbene Spine-Linie am linken Rand, die mit dem Scroll-Fortschritt mitwächst, plus rotiertes Mono-Label „ELEVO — AUSGABE 01 · WACHSTUM". Die Seite liest sich als **Magazin-Ausgabe mit Kapiteln** (Folios 01–05). *(Anders als Scribble: kein §, keine Index-Pills.)*
- **Bewegung:** zurückhaltend (Reveal); der Faden zieht mit dem Scroll. Reduced-Motion- + No-JS-sicher.
- **Bildwelt:** typografisch getrieben; Magazin-Cover als gekippte Editorial-Figuren; Live-Referenzen als Textzeilen mit Riesen-Kennzahl statt Screenshots.
- **Voice:** Storytelling, „du", konkret, selbstbewusst, anti-floskel — szenischer Einstieg, klare Conversion.

## Distanz-Check (≥3 Achsen anders als Referenz) ✓
Typo (Instrument Serif/Mono ↔ Fraunces), Signature (Faden/Kapitel ↔ §/Index-Numerals), Akzent (Vermilion ↔ —), Layout (Hairline-Editorial ↔ Karten).

## Anti-„KI-gebaut" (§7) — bewusst eingesetzt
Bleed-Serif, echte typografische Hierarchie, Hairlines statt Boxen, ein konsequentes Signature-Device, Margin-Numerale, Pull-Quote, Mono-Marginalien, szenisches Copywriting statt Floskeln. Kein zentrierter Hero, keine Pill-Karten-Reihe, keine Emoji.

## Umsetzung
- `src/styles/elevo-mag.css` — self-contained, gescoped unter `body.mag`; Legacy-Chrome-Tokens werden auf die Editorial-Palette gemappt (Header/Footer/Cookie übernehmen sie).
- Schrift self-hosted in `public/fonts/InstrumentSerif*.woff2` (einmalig geladen, DSGVO-konform), Preload nur auf der Startseite (`preloadSerif`).

## Nächste Schritte (vom User freigegeben: „Erst Home, Rest danach")
- Unterseiten in dieselbe Editorial-DNA migrieren.
- Detaillierte **/faq**-Seite (suchsatz-optimiert, FAQPage-Schema) + **/magazin** mit SEO-Artikeln (BlogPosting-Schema).
