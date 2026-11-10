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

## Tracking-Ergänzungen (10.11.2026, gilt für /neukundensystem, /familienrecht, /kanzlei-anleitung, /kanzlei-berlin)

- **Cookie-Banner als Pflicht-Auswahl:** Fenster über der abgedunkelten Seite, bis „Alle akzeptieren“ oder „Nur notwendige“ gewählt ist. Beide Buttons sind gleich gestaltet. Über „Cookie-Einstellungen“ im Footer lässt sich die Wahl ändern.
- **Events (alle nur nach Einwilligung, jedes höchstens 1x pro Seitenaufruf):**
  - `PageView` – jede Seite
  - `ViewContent` – Video gestartet (Play / „Mit Ton ansehen“)
  - `FormStart` (eigenes Event) – erste Auswahl/Eingabe im Formular oder Öffnen des Opt-in-Fensters
  - `Lead` – nur Danke-Seite, nur nach erfolgreichem Versand (≤ 30 Min.)
  - `Schedule` – /kanzlei-anleitung: Gespräch unter dem Video angefragt
  - Vor der Zustimmung passierte Events (z. B. FormStart) werden nach der Zustimmung nachgereicht – ohne Zustimmung nie.
- **Meta-Klick-ID:** `fbclid` aus der Anzeigen-URL wird beim ersten Aufruf gemerkt. Stimmt jemand erst später zu (z. B. auf der Danke-Seite), wird das `_fbc`-Cookie daraus gesetzt, damit Meta den Lead der richtigen Anzeige zuordnet.
- Code: `src/neukundensystem/lib/pixel.ts` (`initPixel`, `trackEvent`, `trackLeadIfAllowed`) und `src/neukundensystem/components/MetaPixel.astro`.
- In Meta: pro Landingpage eine selbstdefinierte Conversion anlegen (Event `Lead`, URL enthält `<pfad>/danke`) und in der Anzeigengruppe als Conversion-Event wählen.
