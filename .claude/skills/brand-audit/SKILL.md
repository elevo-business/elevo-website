---
name: brand-audit
description: Automatisierte ELEVO Brand-CI Prüfung. Checkt Farben, Fonts, Spacing, Dark-Only, Sprache und Tool-Namen gegen die ELEVO Corporate Identity.
---

# /brand-audit — ELEVO Brand-CI Prüfung

Beim Aufruf von `/brand-audit` prüfe den aktuellen Code automatisch gegen die ELEVO Corporate Identity. Führe alle Checks der Reihe nach aus und erstelle einen strukturierten Report.

## Ausführungsreihenfolge

1. Führe `.claude/skills/brand-audit/scripts/check-colors.sh` aus — Farb-Checks
2. Führe `.claude/skills/brand-audit/scripts/check-fonts.sh` aus — Font-Checks
3. Führe `.claude/skills/brand-audit/scripts/check-language.sh` aus — Sprach-Checks
4. Erstelle den finalen Report (Format siehe unten)

## Was geprüft wird

### 1. Farben (check-colors.sh)
- Hardcoded Hex-Werte ausserhalb von `:root` und `global.css`?
- Werden die CI-Farben als CSS Custom Properties referenziert?
- Erlaubte Hex-Werte: `#3B82F6`, `#05070E`, `#0A0E1A`, `#E2E8F0`, `#94A3B8`, `#0F1628`

### 2. Fonts (check-fonts.sh)
- Google Fonts CDN-Referenzen (DSGVO-Verstoss)?
- Fonts korrekt self-hosted aus `/public/`?
- Sora für Headings, Outfit für Body?

### 3. Sprache & Ton (check-language.sh)
- Externe Tool-/Firmennamen sichtbar (Coolify, Zapier, Paperclip, Netcup)?
- "Ich"-Form statt "Wir" in kundenvisiblen Seiten?
- Offensichtlich englische Texte in `.astro` Seiten?

## Report-Format

Erstelle nach den Script-Ausgaben einen strukturierten Markdown-Report:

```
# ELEVO Brand-CI Audit Report
Datum: [aktuelles Datum]
Geprüfte Pfade: src/, public/

## 🎨 Farben
[Ergebnisse aus check-colors.sh]

## 🔤 Fonts
[Ergebnisse aus check-fonts.sh]

## 🗣️ Sprache & Ton
[Ergebnisse aus check-language.sh]

## Zusammenfassung
| Kategorie | Status | Verstösse |
|-----------|--------|-----------|
| Farben    | ✅/❌  | X         |
| Fonts     | ✅/❌  | X         |
| Sprache   | ✅/❌  | X         |

## Gesamtstatus
✅ BRAND-CI KONFORM — alle Checks bestanden
❌ VERSTÖSSE GEFUNDEN — X Probleme beheben
```

## Symbole

- ✅ bestanden / konform
- ❌ Verstoß gefunden (Datei + Zeile angeben)
- ⚠️ Warnung / manuelle Prüfung empfohlen
- ℹ️ Hinweis

## Brand-CI Referenz

Vollständige Regeln: `.claude/skills/brand-audit/resources/brand-reference.md`
