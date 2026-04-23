---
name: deploy-check
description: Pre-Deployment Checkliste fuer ELEVO-Projekte. Prueft Build, SEO, Performance, Brand-CI, Security und Accessibility vor jedem Deployment.
---

# /deploy-check — ELEVO Pre-Deployment Checkliste

Beim Aufruf von `/deploy-check` fuehre alle Checks der Reihe nach durch und erstelle einen strukturierten Report.

## Ausfuehrungsreihenfolge

1. Fuehre `.claude/skills/deploy-check/scripts/check-build.sh` aus
2. Fuehre `.claude/skills/deploy-check/scripts/check-seo.sh` aus
3. Fuehre `.claude/skills/deploy-check/scripts/check-assets.sh` aus
4. Erstelle den finalen Report nach dem Template in `.claude/skills/deploy-check/templates/report.md`

## Manuelle Checks (nicht automatisierbar)

Diese Punkte musst du als Reviewer einschaetzen und im Report mit ⚠️ markieren:

- **Responsive**: Hast du die Seite auf einem Mobilgeraet oder bei 375px viewport getestet?
- **Brand-CI Farben**: Werden nur ELEVO-Farben verwendet (`#3B82F6`, `#05070E`, `#0A0E1A`, `#0F1628`, `#E2E8F0`)? Keine fremden Primaerfarben?
- **Accessibility**: Sind interaktive Elemente per Tastatur erreichbar? Ausreichend Kontrastverhaeltnis (WCAG AA)?
- **Performance**: Sehen die Bilder im Browser scharf und schnell aus?

## Report-Format

Verwende:
- ✅ bestanden (automatisch geprueft)
- ❌ fehlgeschlagen (automatisch geprueft)
- ⚠️ manuelle Pruefung noetig
- ℹ️ Hinweis / Info

Schliesse mit einer klaren Empfehlung ab:
- **✅ DEPLOY FREIGEGEBEN** — alle kritischen Checks bestanden
- **❌ DEPLOY BLOCKIERT** — X kritische Probleme beheben vor Deployment
