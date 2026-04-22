#!/usr/bin/env bash
# ELEVO Brand-CI: Farb-Check
# Prüft hardcoded Hex-Werte gegen ELEVO CI
# Scope: ELEVO Hauptseiten (src/pages/*.astro, src/components, src/layouts)
# Ausgenommen: global.css, Template-Themes, Previews, Demos (eigene Kundenbrands)

set -euo pipefail

PROJ_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SRC="$PROJ_ROOT/src"
GLOBAL_CSS="$PROJ_ROOT/src/styles/global.css"

lowercase() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

is_allowed_color() {
  local color_lower
  color_lower=$(lowercase "$1")
  local allowed=(
    "#3b82f6"  # --accent
    "#05070e"  # --bg-deep
    "#0a0e1a"  # --bg-dark
    "#e2e8f0"  # --text-primary
    "#94a3b8"  # --text-secondary
    "#0f1628"  # Zusatzton
    "#1e3a5f"  # Hover-Variante
    "#1d4ed8"  # Blue 700 Hover
    "#60a5fa"  # Blue 400 (erlaubt als Akzent-Variante)
    "#ffffff"  # Weiss (erlaubt in SVG/Icons)
    "#fff"
    "#000000"
    "#000"
  )
  for a in "${allowed[@]}"; do
    if [[ "$color_lower" == "$a" ]]; then
      return 0
    fi
  done
  return 1
}

echo "## 🎨 Farben-Check"
echo ""
echo "ℹ️  Scope: ELEVO Hauptseiten (components, layouts, pages root)"
echo "ℹ️  Ausgenommen: global.css, /previews/, /demos/, /templates/themes/"
echo ""

VIOLATIONS=0
WARNINGS=0

# Nur ELEVO-eigene Dateien prüfen (nicht Kunden-Previews/Demos)
SCAN_DIRS=(
  "$SRC/components"
  "$SRC/layouts"
)

# Pages root (nur *.astro direkt in pages/, nicht Unterordner)
while IFS= read -r file; do
  # Skip wenn kein Hex-Wert vorhanden
  if ! grep -qiE "#[0-9a-f]{3,8}" "$file" 2>/dev/null; then
    continue
  fi

  while IFS= read -r match; do
    hex_color=$(echo "$match" | grep -oiE "#[0-9a-f]{3,8}" | head -1)
    line_num=$(echo "$match" | cut -d: -f1)

    if [[ -z "$hex_color" ]]; then
      continue
    fi

    if ! is_allowed_color "$hex_color"; then
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ Nicht-CI Farbe '$hex_color' — $rel_file:$line_num"
      ((VIOLATIONS++)) || true
    fi
  done < <(grep -n -iE "#[0-9a-f]{3,8}" "$file" 2>/dev/null || true)

done < <(find "$SRC/pages" -maxdepth 1 -name "*.astro" -type f 2>/dev/null)

# Components und Layouts
for dir in "${SCAN_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi
  
  while IFS= read -r file; do
    if ! grep -qiE "#[0-9a-f]{3,8}" "$file" 2>/dev/null; then
      continue
    fi

    while IFS= read -r match; do
      hex_color=$(echo "$match" | grep -oiE "#[0-9a-f]{3,8}" | head -1)
      line_num=$(echo "$match" | cut -d: -f1)

      if [[ -z "$hex_color" ]]; then
        continue
      fi

      if ! is_allowed_color "$hex_color"; then
        rel_file="${file#$PROJ_ROOT/}"
        echo "❌ Nicht-CI Farbe '$hex_color' — $rel_file:$line_num"
        ((VIOLATIONS++)) || true
      fi
    done < <(grep -n -iE "#[0-9a-f]{3,8}" "$file" 2>/dev/null || true)

  done < <(find "$dir" -name "*.astro" -o -name "*.css" 2>/dev/null | grep -v node_modules)
done

# CSS Custom Properties in Hauptdateien prüfen
echo ""
echo "### CSS Custom Property Nutzung"
NON_VAR_COUNT=$(find "$SRC/components" "$SRC/layouts" "$SRC/pages" -maxdepth 1 -name "*.astro" -exec grep -l "color:[[:space:]]*#" {} \; 2>/dev/null | wc -l | tr -d " ")
if [[ "$NON_VAR_COUNT" -gt 0 ]]; then
  echo "⚠️  In $NON_VAR_COUNT Dateien direkte Farbzuweisungen statt var(--...) — CSS Custom Properties bevorzugen"
  ((WARNINGS++)) || true
else
  echo "✅ Farbzuweisungen nutzen CSS Custom Properties"
fi

# Previews/Demos info
PREVIEW_VIOLATIONS=$(find "$SRC/pages/previews" "$SRC/pages/demos" -name "*.astro" 2>/dev/null -exec grep -cE "#[0-9a-fA-F]{3,8}" {} \; 2>/dev/null | awk '{sum += $1} END {print sum+0}')
if [[ "$PREVIEW_VIOLATIONS" -gt 0 ]]; then
  echo ""
  echo "ℹ️  Previews/Demos: $PREVIEW_VIOLATIONS Hex-Farbwerte (kunden-spezifisch, nicht ELEVO CI — ignoriert)"
fi

echo ""
if [[ "$VIOLATIONS" -eq 0 ]]; then
  echo "✅ **Farben:** Keine unerlaubten Hex-Werte in ELEVO Hauptseiten"
else
  echo "❌ **Farben:** $VIOLATIONS unerlaubte Hex-Werte in ELEVO Hauptseiten"
fi

[[ "$VIOLATIONS" -eq 0 ]]
