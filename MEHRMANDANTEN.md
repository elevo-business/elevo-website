# Landingpage /mehrmandanten (Mandantengewinnung für Anwaltskanzleien)

Landingpage für Kanzleien aller Rechtsgebiete, die planbar mehr Anfragen für ihre Wunschmandate wollen. Technik wie /kanzlei-berlin: Astro (statisch) + Tailwind, eigenes Layout ohne seitenweiten Pixel/Google-Tag, Versand an die HubSpot Forms API, Meta Pixel nach Einwilligung, `Lead` nur auf der Danke-Seite.

- `/mehrmandanten/`: dunkler Hero mit Foto und drei Versprechen → Verhalten der Mandanten → Fallstudien als dunkle Karten (Vorher, Ergebnis, Maßnahmen, Mockup der gebauten Seite, Belege) → Leistungen mit Illustration und Checkliste → Ablauf → Über mich → FAQ → Abschluss. Alle CTAs führen zum Formular.
- `/mehrmandanten/anfrage/`: Qualifizierungsformular (eine Frage pro Bildschirm).
- `/mehrmandanten/danke/`: Danke-Seite mit „Nummer speichern“ (`.vcf`).
- Alle drei Seiten `noindex` (`seo.noindex`), nicht in der Sitemap.

**Alle Texte, Fragen und IDs stehen in `src/config/mehrmandanten.json`.** Ansprache: Du, bewusst im Gesprächston. Auszeichnung in den Texten: `**fett**`, Akzentfarbe in Überschriften: `*so*`.

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

## Bilder

Liegen in `src/mehrmandanten/images/`.

- `hero-mert.jpg`: Hero-Foto
- `site-<kunde>-desktop.png` / `-mobil.png`: Screenshots der gebauten Seiten (JusLegal: online.juslegal.de, Greenchild: lp/sachwert-d, BML), werden in Browser- und Handy-Rahmen gezeigt
- `ads-juslegal*.png`, `ads-greenchild-mobil.png`: Meta-Werbeanzeigenmanager, Leads im Bild hervorgehoben
- `pipedrive-greenchild.png`: CRM, Umsatz gewonnener Deals

Die Illustrationen bei „Leistungen“ (Beispielanzeige, Vorprüfung, Benachrichtigung) sind HTML, Texte in `leistungen.mock`.

## Offen / prüfen

- Zuordnung der Werbekonto-Screenshots zu den Kunden bestätigen.
- JusLegal: Text nennt 11 qualifizierte Anfragen, der Screenshot zeigt 10 Website-Leads.
- Freigabe von Dr. Hauke Scheffler für die namentliche Nennung und die „Vorher“-Beschreibung einholen.
- „Vorher“ bei Greenchild ist aus dem Kundenzitat abgeleitet; BML hat bewusst kein „Vorher“.
- Kundenstimmen von JusLegal und BML fehlen noch.
- Optional eigenes OG-Bild: `public/og-mehrmandanten.jpg`.

## Dateien

```
src/config/mehrmandanten.json     Texte, Fragen, IDs
src/pages/mehrmandanten/          index.astro, anfrage.astro, danke.astro, mert-efe-celik.vcf.ts
src/mehrmandanten/                Layout, Komponenten, Styles, Bilder
public/fonts/BebasNeue-*          Hero-Schrift (lokal, OFL)
```
