#!/usr/bin/env bash
# ELEVO Brand-CI: Font-Check
# Prüft Font-Loading, CDN-Referenzen und korrekte Font-Verwendung

set -euo pipefail

PROJ_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SRC="$PROJ_ROOT/src"
PUBLIC="$PROJ_ROOT/public"

echo "## 🔤 Font-Check"
echo ""

VIOLATIONS=0

# 1. Google Fonts CDN Check (DSGVO-Verstoss)
echo "### Google Fonts / CDN Check"
CDN_HITS=$(grep -rn "fonts.googleapis.com\|fonts.gstatic.com\|use.typekit.net\|fast.fonts.net" "$SRC" 2>/dev/null || true)
if [[ -n "$CDN_HITS" ]]; then
  echo "❌ Google/CDN Font-Referenzen gefunden (DSGVO-Verstoss!):"
  while IFS= read -r hit; do
    file=$(echo "$hit" | cut -d: -f1)
    rel_file="${file#$PROJ_ROOT/}"
    line=$(echo "$hit" | cut -d: -f2)
    echo "   ❌ $rel_file:$line"
    ((VIOLATIONS++))
  done <<< "$CDN_HITS"
else
  echo "✅ Keine Google/CDN Font-Referenzen gefunden"
fi

# 2. Self-hosted Fonts in public/
echo ""
echo "### Self-hosted Fonts (public/)"
SORA_FILES=$(find "$PUBLIC" -name "Sora*" -o -name "sora*" 2>/dev/null | head -5)
OUTFIT_FILES=$(find "$PUBLIC" -name "Outfit*" -o -name "outfit*" 2>/dev/null | head -5)

if [[ -z "$SORA_FILES" ]]; then
  echo "❌ Sora Font-Dateien nicht in public/ gefunden"
  ((VIOLATIONS++))
else
  COUNT=$(echo "$SORA_FILES" | wc -l | tr -d ' ')
  echo "✅ Sora Font self-hosted ($COUNT Datei/en)"
fi

if [[ -z "$OUTFIT_FILES" ]]; then
  echo "❌ Outfit Font-Dateien nicht in public/ gefunden"
  ((VIOLATIONS++))
else
  COUNT=$(echo "$OUTFIT_FILES" | wc -l | tr -d ' ')
  echo "✅ Outfit Font self-hosted ($COUNT Datei/en)"
fi

# 3. Font-Format Check (woff2 bevorzugt)
echo ""
echo "### Font-Format (woff2 bevorzugt)"
NON_WOFF2=$(find "$PUBLIC" \( -name "*.ttf" -o -name "*.otf" -o -name "*.woff" \) 2>/dev/null | grep -v node_modules || true)
if [[ -n "$NON_WOFF2" ]]; then
  echo "⚠️  Nicht-woff2 Fonts gefunden (Performance):"
  while IFS= read -r f; do
    rel="${f#$PROJ_ROOT/}"
    echo "   ⚠️  $rel"
  done <<< "$NON_WOFF2"
else
  echo "✅ Alle Fonts im woff2-Format"
fi

# 4. CSS @font-face Check in global.css
echo ""
echo "### @font-face Definitionen"
GLOBAL_CSS="$SRC/styles/global.css"
if [[ -f "$GLOBAL_CSS" ]]; then
  SORA_FACE=$(grep -c "Sora\|sora" "$GLOBAL_CSS" 2>/dev/null || echo "0")
  OUTFIT_FACE=$(grep -c "Outfit\|outfit" "$GLOBAL_CSS" 2>/dev/null || echo "0")
  
  if [[ "$SORA_FACE" -gt 0 ]]; then
    echo "✅ Sora in global.css definiert"
  else
    echo "❌ Sora nicht in global.css definiert"
    ((VIOLATIONS++))
  fi
  
  if [[ "$OUTFIT_FACE" -gt 0 ]]; then
    echo "✅ Outfit in global.css definiert"
  else
    echo "❌ Outfit nicht in global.css definiert"
    ((VIOLATIONS++))
  fi
else
  echo "⚠️  global.css nicht gefunden unter $GLOBAL_CSS"
fi

# 5. font-display: swap Check
echo ""
echo "### font-display Optimierung"
if [[ -f "$GLOBAL_CSS" ]]; then
  SWAP_COUNT=$(grep -c "font-display.*swap\|swap" "$GLOBAL_CSS" 2>/dev/null || echo "0")
  if [[ "$SWAP_COUNT" -gt 0 ]]; then
    echo "✅ font-display: swap gesetzt"
  else
    echo "⚠️  font-display: swap nicht gefunden (Performance-Empfehlung)"
  fi
fi

echo ""
if [[ "$VIOLATIONS" -eq 0 ]]; then
  echo "✅ **Fonts:** Alle Font-Checks bestanden"
else
  echo "❌ **Fonts:** $VIOLATIONS Problem(e) gefunden"
fi

exit $VIOLATIONS
