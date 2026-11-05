# Landingpage /kanzlei-anleitung (Lead-Magnet für Kanzleien)

Lead-Magnet-Funnel für die eigenen Meta Ads an Kanzleien (alle Rechtsgebiete): kostenlose Video-Anleitung gegen Kontaktdaten. Aufbau und Technik wie /familienrecht: Astro (statisch) + Tailwind, eigenes Layout ohne den seitenweiten elevo.solutions-Pixel/Google-Tag, Formular an die HubSpot Forms API, Meta Pixel (nach Einwilligung) auf allen Seiten, Lead-Event nur auf der Danke-Seite.

- `https://elevo.solutions/kanzlei-anleitung/`: Headline → Video-Vorschau → CTA → „Das erfahren Sie in der Anleitung“ → Ergebnisse → Über mich → Abschluss-CTA. Jeder CTA öffnet das Opt-in als Dialog (Name, E-Mail, Mobilnummer, Einwilligung).
- `https://elevo.solutions/kanzlei-anleitung/danke/`: „Zugang freigeschaltet“ + das Video. Nur hier feuert das Conversion-Event `Lead`.
- Beide Seiten sind `noindex` und stehen nicht in der Sitemap (nur Ads-Traffic).

**Alle Texte, IDs und Links stehen in `src/config/kanzlei-anleitung.json`.** Fett im Text: `**so**` (in `benefits.items`).

## Offen vor dem Go-live

| Was | Wo |
| --- | --- |
| Video-Anleitung | `public/kanzlei-anleitung/anleitung.mp4` (+ Vorschaubild `anleitung-poster.jpg`). Hochformat ist eingestellt (`thankYou.video.aspect: "9:16"`), bei Querformat `"16:9"`. |
| Dauer des Videos | `hero.videoCardMeta` |
| Inhalt der Anleitung | `benefits.items` – die vier Punkte müssen zu dem passen, was im Video tatsächlich vorkommt. |
| Nächster Schritt nach dem Video | `thankYou.cta`: `enabled` auf `true` setzen und Überschrift, Text, Button-Text und Link eintragen (z. B. Link zu `/familienrecht/` oder zu einem Buchungskalender). Solange `enabled` `false` ist, erscheint nichts. |
| Eigenes OG-Bild (optional) | `public/og-kanzlei-anleitung.jpg`, sonst wird das Standardbild genutzt. |

Beim `bun run build` listet die Konsole alle noch offenen `[…]`-Platzhalter und die fehlende Videodatei auf.

## HubSpot

- Gleiches HubSpot-Formular wie /familienrecht (`form.hubspot`). Die Leads sind über das versteckte Feld `lp_variante = kanzlei-anleitung` erkennbar (z. B. für eine eigene Liste, Benachrichtigung oder einen Workflow).
- Gesendet werden: `firstname` und `lastname` (aus „Vor- und Nachname“, erstes Wort = Vorname), `email`, `phone` (im Format +49…), `lp_variante`, UTM-Parameter und `fbclid` (wenn in der URL), dazu die Einwilligung (`legalConsentOptions`).
- Soll der Lead-Magnet ein eigenes HubSpot-Formular bekommen: neues Formular mit denselben Feldern anlegen und nur `form.hubspot.formGuid` austauschen.

## Tracking und Einwilligung

- Pixel `tracking.metaPixelId` (derselbe wie /neukundensystem und /familienrecht): `PageView` auf allen Seiten, aber erst nach Marketing-Einwilligung.
- `Lead` (mit `eventID`) nur auf der Danke-Seite, nur nach erfolgreichem Versand (≤ 30 Minuten). Neuladen oder Direktaufruf zählt keinen zweiten Lead.
- Die Einwilligung wird mit dem Rest von elevo.solutions geteilt (`elevo_consent_v2`).

## Lokal starten und deployen

```bash
bun install
bun run dev      # http://localhost:4321/kanzlei-anleitung/
bun run build
```

Änderungen per Pull Request auf `main` → Coolify deployt automatisch auf elevo.solutions.

## Dateien

```
src/config/kanzlei-anleitung.json        Texte, IDs, Links
src/pages/kanzlei-anleitung/index.astro  Opt-in-Seite
src/pages/kanzlei-anleitung/danke.astro  Danke-Seite mit Video
src/kanzlei-anleitung/                   Layout, Komponenten (OptinForm = Dialog + Versand), Styles
public/kanzlei-anleitung/                Video + Vorschaubild
```

HubSpot-Versand, UTM, Einwilligung, Pixel und Video-Player nutzen die Bausteine aus `src/neukundensystem/`.
