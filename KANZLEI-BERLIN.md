# Landingpage /kanzlei-berlin (Familien- und Erbrecht, Berlin)

Landingpage für die lokalen Evergreen-Meta-Ads (persönliches Profil) an Kanzleien im Familien- und Erbrecht in Berlin. Technik wie /familienrecht: Astro (statisch) + Tailwind, eigenes Layout ohne den seitenweiten Pixel/Google-Tag, Versand an die HubSpot Forms API, Meta Pixel nach Einwilligung, `Lead` nur auf der Danke-Seite.

- `https://elevo.solutions/kanzlei-berlin/`: Headline + Garantie-Box → Quiz (direkt im ersten Bildschirm) → Ergebnisse (Greenchild mit Zitat, BML) → So kommen die Mandate zu Ihnen → Garantie + Ablauf → Über mich → FAQ → Abschluss-CTA
- `https://elevo.solutions/kanzlei-berlin/danke/`: Danke-Seite mit „Nummer speichern“ (`.vcf`)
- Beide Seiten `noindex`, nicht in der Sitemap.

**Alle Texte, Fragen, IDs stehen in `src/config/kanzlei-berlin.json`.** Fett: `**so**` (in `hero.trust`).

## Headline passend zur Anzeige (Message Match)

| Anzeige | Ziel-URL | Headline |
| --- | --- | --- |
| Skript 1: Empfehlungen | `https://elevo.solutions/kanzlei-berlin/?h=a` | Neue Mandate für Ihre Kanzlei. Planbar, nicht nur über Empfehlungen. |
| Skript 2: „Werbung ist unseriös“ | `https://elevo.solutions/kanzlei-berlin/?h=b` | Seriöse Anzeigen, die Mandanten aus Berlin direkt zu Ihnen bringen. |
| Skript 3: Erstgespräche | `https://elevo.solutions/kanzlei-berlin/?h=c` | Nur noch Erstgespräche, die sich für Ihre Kanzlei lohnen. |

Die Variante geht als `lp_headline` an HubSpot, so sieht man, welche Anzeige welche Leads bringt.

## Quiz (5 Schritte, eine Frage pro Bildschirm)

| # | Frage | HubSpot-Property |
| --- | --- | --- |
| 1 | Woher kommen neue Mandate heute | `lead_akquise` |
| 2 | Zusätzliche Mandate pro Monat | `lead_kapazitaet` |
| 3 | Wer ruft zurück | `lead_rueckruf` + `fr_rueckruf` |
| 4 | Monatliches Werbebudget | `lead_werbebudget` |
| 5 | Vorname*, Kanzlei, Telefon*, E-Mail*, Einwilligung* | `firstname`, `company`, `phone`, `email` |

Gleiches HubSpot-Formular wie /familienrecht. Alle Properties gibt es dort schon, es ist keine Einrichtung nötig. Leads erkennbar an `lp_variante = kanzlei-berlin`. Priorität A/B/C wie bei /familienrecht (`lp_prioritaet`, A ab 3 grünen Antworten, C bei einer roten).

## Offen / prüfen

- Garantie-Bedingungen (`guarantee.items`, FAQ): aktuell „keine passenden Anfragen in 30 Tagen → Geld zurück, Kriterien vor dem Start schriftlich“.
- 7 Werktage gelten „nach dem Start der Anzeigen“.
- Optional eigenes OG-Bild: `public/og-kanzlei-berlin.jpg`.

## Dateien

```
src/config/kanzlei-berlin.json        Texte, Fragen, IDs
src/pages/kanzlei-berlin/             index.astro, danke.astro, mert-efe-celik.vcf.ts
src/kanzlei-berlin/                   Layout, Komponenten (Kopie von /familienrecht, vereinfacht), Styles
public/kanzlei-berlin/                Referenz-Logos
```
