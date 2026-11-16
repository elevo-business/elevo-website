# Landingpage /mehrmandanten (Mandantengewinnung für Anwaltskanzleien)

Landingpage für Kanzleien aller Rechtsgebiete, die planbar mehr Anfragen für ihre Wunschmandate wollen. Technik wie /kanzlei-berlin: Astro (statisch) + Tailwind, eigenes Layout ohne seitenweiten Pixel/Google-Tag, Versand an die HubSpot Forms API, Meta Pixel nach Einwilligung, `Lead` nur auf der Danke-Seite.

- `/mehrmandanten/`: Hero mit JusLegal-Beleg → Problem → Verhalten der Mandanten → Fallstudien (JusLegal, Greenchild, BrandsMarketingLab) → Leistungen → Ablauf → Über mich → FAQ → Abschluss. Alle CTAs führen zum Formular.
- `/mehrmandanten/anfrage/`: Qualifizierungsformular (eine Frage pro Bildschirm).
- `/mehrmandanten/danke/`: Danke-Seite mit „Nummer speichern“ (`.vcf`).
- Alle drei Seiten `noindex` (`seo.noindex`), nicht in der Sitemap.

**Alle Texte, Fragen und IDs stehen in `src/config/mehrmandanten.json`.** Ansprache: Du. Kursiv-Akzent in Überschriften: `*so*`.

## Formular (6 Schritte)

| # | Frage | HubSpot-Property |
| --- | --- | --- |
| 1 | Rechtsgebiet | `lead_rechtsgebiet` |
| 2 | Anzahl Anwältinnen und Anwälte | `lead_kanzlei_groesse` |
| 3 | Woher kommen Mandanten heute | `lead_akquise` |
| 4 | Zusätzliche Mandate pro Monat | `lead_kapazitaet` |
| 5 | Monatliches Werbebudget | `lead_werbebudget` |
| 6 | Vorname*, Kanzlei, Telefon*, E-Mail*, Einwilligung* | `firstname`, `company`, `phone`, `email` |

Gleiches HubSpot-Formular wie /kanzlei-berlin. Leads erkennbar an `lp_variante = mehrmandanten`. Priorität (`lp_prioritaet`): C bei „Gerade keine, wir sind voll“ oder „Unter 1.000 €“, A ab 2 grünen Antworten, sonst B.

## Screenshots (Belege)

Liegen in `src/mehrmandanten/images/`. Die Leads sind direkt im Bild hervorgehoben (Rest aufgehellt, Rahmen in Teal). Für neue Screenshots: Originale im selben Stil bearbeiten und die Dateien ersetzen.

- `ads-juslegal*.png`: Meta-Werbeanzeigenmanager JusLegal (10 Website-Leads, 42,63 € pro Lead)
- `ads-greenchild-mobil.png`: Meta-Werbeanzeigenmanager Greenchild (145 Website-Leads)
- `pipedrive-greenchild.png`: CRM, Umsatz gewonnener Deals (32.406 €)

## Offen / prüfen

- Zuordnung der Screenshots zu den Kunden bestätigen (siehe oben).
- JusLegal: Text nennt 11 qualifizierte Anfragen, der Screenshot zeigt 10 Website-Leads.
- „Ausgangslage“ bei JusLegal, Greenchild und BML ist aus dem Kontext formuliert, bitte gegenlesen.
- Optional eigenes OG-Bild: `public/og-mehrmandanten.jpg`.

## Dateien

```
src/config/mehrmandanten.json     Texte, Fragen, IDs
src/pages/mehrmandanten/          index.astro, anfrage.astro, danke.astro, mert-efe-celik.vcf.ts
src/mehrmandanten/                Layout, Komponenten, Styles, Bilder
public/fonts/InstrumentSerif-*    Überschriften-Schrift (lokal, OFL)
```
