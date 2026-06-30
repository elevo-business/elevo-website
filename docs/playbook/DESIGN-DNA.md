# DESIGN-DNA — Elevo (Flagship „Dossier")

> Iteration nach Feedback: Copy auf Award-Niveau, klare Differenzierung von der
> Referenz (Scribble: hell, Serif/Fraunces, Index-Numerals + §) und Verzicht auf
> das als „pushy/generisch" empfundene Stufen-/Treppen-Framing.

## Achsen
- **Typo-System:** **Bricolage Grotesque** (variabel, self-hosted) als charaktervolle Grotesk-Display — bewusst KEINE Serif-Editorial-Folie wie Scribble. **Instrument Serif** nur als sparsamer Italic-Akzent (einzelne Wörter, Pull-Quotes) für Spannung. **Outfit** Body, **System-Mono** für Masthead/Labels/Meta.
- **Farbstrategie:** **near-monochrom Bone + Ink**, ein **elektrischer Cobalt-Akzent (#1E27E6)** extrem sparsam (Labels, Links, ein Markierungs-Unterstrich). Die Zurückhaltung = Galerie-/Award-Anmutung statt Tech-Bunt.
- **Layout-Archetyp:** Editorial-Zeitung. **Masthead-Zeile** statt Standard-Hero, Hairlines statt Boxen, Triptychon mit harten Trennlinien, Riesen-Grotesk-Headlines.
- **SIGNATURE / Konzept:** **Aphorismus-Hero** („Du verlierst keine Kunden an bessere Anbieter. Nur an *sichtbarere*.") + Masthead-Identität. Der Hero ist copy-getrieben und einzigartig, kein Mockup, keine Kennzahl-Kachel.
- **Offer-Framing (NEU, kein Ladder):** „**Drei Handwerke. Ein Ziel: unübersehbar.**" — Gefunden / Erinnert / Nachgefragt werden als **gleichwertiges Triptychon**, ergebnis-geframed statt „Stufe 01 → kauf die nächste".
- **Voice:** Award-Copy nach `COPY-VOICE.md` — szenisch, Standpunkt pro Block, konkret, anti-Floskel, „du".

## Distanz-Check vs. Scribble (≥3 Achsen anders) ✓
Display Grotesk statt Serif · Masthead/Zeitung statt §-Magazin · near-monochrom+Cobalt statt warmem Creme · Aphorismus-Hero statt „Wachstumspartner für kleine Unternehmen"-Aufmacher.

## SEO (Top-Niveau, nach erfolgreichen Studien: Intent + Helpful Content + E-E-A-T)
- Eigene **/faq**-Seite: Überschriften = echte Suchsätze, 40–55-Wort-Snippet-Antwort zuerst, thematisch gruppiert, **FAQPage**- + **BreadcrumbList**-Schema.
- **/magazin** + 3 Tiefe-Artikel (echte Suchintention): „was kostet eine professionelle website", „lohnt sich ein kundenmagazin", „mehr anfragen über die website". Je **BlogPosting**- + **BreadcrumbList**-Schema, Answer-Snippet oben, interne Verlinkung, E-E-A-T über echte Projekte (GreenChild/Akropolis/HEKO).
- Index als **ItemList**-Schema. BaseLayout: WebSite-Schema, geo-Meta, og:image-Maße.

## Assets
- Fonts self-hosted (DSGVO): `public/fonts/BricolageGrotesque-latin.woff2`, `InstrumentSerif*-latin.woff2`. Preload auf Editorial-Seiten via `preloadSerif`.
- `src/styles/elevo-mag.css` (scoped `body.mag`) trägt Home, FAQ, Magazin & Artikel.

## Offen / nächster Schritt
Unterseiten (leistungen/referenzen/ueber-uns/kontakt) noch im alten Design → in die Dossier-DNA migrieren. Cobalt-Akzent ist ein Token (1 Stelle) — leicht zu retunen, falls gewünscht.
