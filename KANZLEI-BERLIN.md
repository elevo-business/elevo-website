# Landingpage /kanzlei-berlin (Familien- und Erbrecht, Berlin)

Landingpage für die lokalen Evergreen-Meta-Ads (persönliches Profil) an Kanzleien im Familien- und Erbrecht in Berlin. Technik wie /familienrecht: Astro (statisch) + Tailwind, eigenes Layout ohne den seitenweiten Pixel/Google-Tag, Versand an die HubSpot Forms API, Meta Pixel nach Einwilligung, `Lead` nur auf der Danke-Seite.

- `https://elevo.solutions/kanzlei-berlin/`: bewusst minimal: Headline → Quiz → 4 Versprechen (`trust.items`) → Ergebnisse (JusLegal, Greenchild mit Zitat, BML) → FAQ. Keine weiteren Abschnitte, damit nichts vom Formular ablenkt.
- `https://elevo.solutions/kanzlei-berlin/danke/`: Danke-Seite mit „Nummer speichern“ (`.vcf`)
- Beide Seiten `noindex`, nicht in der Sitemap.

**Alle Texte, Fragen, IDs stehen in `src/config/kanzlei-berlin.json`.** Fett: `**so**` (in `hero.trust`).

## Headline passend zur Anzeige (Message Match)

| Anzeige | Ziel-URL | Headline |
| --- | --- | --- |
| Skript 1: Empfehlungen | `https://elevo.solutions/kanzlei-berlin/?h=a` | Planbar neue Mandate für Ihre Kanzlei, statt jeden Monat zu hoffen, dass wieder eine Empfehlung kommt. |
| Skript 2: „Werbung ist unseriös“ | `https://elevo.solutions/kanzlei-berlin/?h=b` | Mandanten aus Berlin gewinnen, die gerade einen Anwalt suchen, mit Anzeigen, die so seriös wirken wie Ihre Kanzlei. |
| Skript 3: Erstgespräche | `https://elevo.solutions/kanzlei-berlin/?h=c` | Nur noch Erstgespräche führen, aus denen auch ein Mandat wird, weil jede Anfrage vorher geprüft ist. |

Die Variante geht als `lp_headline` an HubSpot, so sieht man, welche Anzeige welche Leads bringt.

## Quiz (5 Schritte, eine Frage pro Bildschirm)

| # | Frage | HubSpot-Property |
| --- | --- | --- |
| 1 | Woher kommen neue Mandate heute | `lead_akquise` |
| 2 | Zusätzliche Mandate pro Monat | `lead_kapazitaet` |
| 3 | Wer ruft zurück | `lead_rueckruf` + `fr_rueckruf` |
| 4 | Monatliches Werbebudget | `lead_werbebudget` |
| 5 | Vorname*, Kanzlei, Telefon*, E-Mail*, Einwilligung* | `firstname`, `company`, `phone`, `email` |

Die Antworttexte sind in der Sprache der Zielgruppe formuliert; über `hubspotValues` gehen weiterhin dieselben Werte wie bei /familienrecht an HubSpot (Auswertungen bleiben vergleichbar). Gleiches HubSpot-Formular wie /familienrecht. Alle Properties gibt es dort schon, es ist keine Einrichtung nötig. Leads erkennbar an `lp_variante = kanzlei-berlin`. Priorität A/B/C wie bei /familienrecht (`lp_prioritaet`, A ab 3 grünen Antworten, C bei einer roten).

## Offen / prüfen

- Garantie-Bedingungen (`trust.items`, FAQ): aktuell „keine passenden Anfragen in 30 Tagen → Geld zurück, Kriterien vor dem Start schriftlich“.
- 7 Werktage gelten „nach dem Start der Anzeigen“.
- Optional eigenes OG-Bild: `public/og-kanzlei-berlin.jpg`.

## Dateien

```
src/config/kanzlei-berlin.json        Texte, Fragen, IDs
src/pages/kanzlei-berlin/             index.astro, danke.astro, mert-efe-celik.vcf.ts
src/kanzlei-berlin/                   Layout, Komponenten (Kopie von /familienrecht, vereinfacht), Styles
public/kanzlei-berlin/                Referenz-Logos
```
