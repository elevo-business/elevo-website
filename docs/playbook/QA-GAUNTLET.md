# QA-Gauntlet — Elevo Repositioning (§6 WEBSITEQUALITYPLAYBOOK)

Geprüft am Build des Repositionings (Astro static, `bun run build`, 43 Seiten).
Automatisiert via Chromium (playwright-core), Seiten: `/`, `/leistungen`,
`/referenzen`, `/ueber-uns`, `/kontakt`.

## Build & Links
- [x] Produktionsbuild fehlerfrei (43 Seiten, keine Errors).
- [x] Interne Links/Anker geprüft: Header/Footer-Ziele (`/#system`, `/#mechanismus`, `/#prozess`, `/#referenzen`, `/leistungen`, `/ueber-uns`, `/kontakt`, `/impressum`, `/datenschutz`) existieren; neue Anker `#print` vorhanden.
- [x] Keine Platzhalter („lorem"/„TODO") in den Marketing-Texten.

## Responsive & Overflow
- [x] **0 horizontaler Overflow** gemessen (`scrollWidth ≤ innerWidth`) auf allen 5 Seiten bei 320/360/390/414/768/1280/1920 px.
- [x] Neue Print-Showcase-Sektion bricht <768 px sauber auf 1 Spalte um (zentriert).
- [x] Sticky-Mobile-CTA vorhanden (Wachstumsgespräch).

## Funktion
- [x] Keine Konsolen-/Page-Errors im Code.
- [~] Referenz-iframes (greenchild/bml/akropolis): externer Connection-Fehler **nur in der Sandbox** (kein Outbound); live laden sie. Live-Öffnen-Fallback (Modal + „In neuem Tab öffnen") vorhanden. → vor Go-live live gegenprüfen.
- [x] Kontaktformular-Logik + Tracking unangetastet (nur Copy/Optionen aktualisiert).

## No-JS & Reduced-Motion  *(Playbook §10 — Fund + Fix)*
- [x] **Fund:** `.reveal`-Inhalte waren ohne JS unsichtbar (58/24/5 Elemente, `opacity:0`).
- [x] **Fix:** `<noscript>`-Style-Fallback in `BaseLayout.astro` + `PreviewLayout.astro` → ohne JS jetzt **0** unsichtbare Reveal-Elemente (verifiziert mit `javaScriptEnabled:false`).
- [x] `prefers-reduced-motion`: bestehende Regel macht Reveal sofort sichtbar (Animationen aus).

## SEO & Meta
- [x] Title/Description/Canonical/OG je Seite einzigartig & neu positioniert.
- [x] JSON-LD aktualisiert: ProfessionalService (BaseLayout, 3-Stufen-OfferCatalog), FAQPage (Home, synchron mit FAQ.astro), CollectionPage (Referenzen), Person (Über uns). Build valide.
- [x] deploy-check `check-seo.sh`: alle 10 Hauptseiten bestanden.

## Recht & Inhalt
- [x] Impressum/Datenschutz unverändert (echte Daten, Netcup-Hosting korrekt benannt).
- [x] Magazine: persönliche Ansprechpartner-Daten → Platzhalter ([Name]/[Ansprechpartner]/[Telefon]/[E-Mail]/[Firmenname]); Text-Scan bestätigt clean.
- [x] Kennzahlen vom Auftrag bestätigt: GreenChild 25 qualifizierte Leads / 1. Monat. **Fabrizierte Zahl entfernt:** BML „2x mehr Anfragen" → neutral „Conversion-Website, die das Angebot verkauft".

## Voice (§8)
- [x] Visible Copy frei von Verbotsliste-Floskeln; projektspezifische Tabus (Coach/Berater/Klient/14-Tage/Funnel-Check) aus allen sichtbaren Texten entfernt.
- [x] Keine EUR-Preisanker auf Marketing-Seiten; Soft-CTA „Wachstumsgespräch".

## Brand-CI (brand-audit)
- [x] Fonts self-hosted, kein Google-CDN; Dark/Light-Theme unverändert.
- [~] Hardcoded Hex-Warnungen: ausschließlich **pre-existing** (Demo-Seite `erlebniswelt`, Google-/Stern-Markenfarben im Reviews-Widget, Logo/Hero/LegalModal) — durch dieses Repositioning **kein neuer** Hex eingeführt (Print-Styles nutzen `var(--…)`/`rgba`).

## Offene Punkte (vor Go-live mit CEO)
1. Referenz-iframes live gegenprüfen (Sandbox kann nicht nach außen).
2. GreenChild-PDF ist 13,5 MB (Download-Asset) — optional komprimieren.
3. Magazin-Porträtfotos der Ansprechpartner bleiben sichtbar — bei Bedarf durch neutralen Avatar ersetzen (Daten sind bereits anonymisiert).
4. Staging-Gate (CLAUDE.md): erst auf Staging deployen, CEO-Live-Look, dann Cut-over.
