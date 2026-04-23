#!/usr/bin/env bash
# check-assets.sh — Prueft Performance-Assets und Security (ELEVO elevo-astro)

set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

ERRORS=0
WARNINGS=0
SIZE_LIMIT=512000  # 500KB in Bytes

echo "=== ASSETS & SECURITY CHECK ==="

# 1. Bildgroessen pruefen — nur public/ (nicht dist/, keine Kunden-Preview-Images)
echo "--- Performance: Bildgroessen ---"
LARGE_IMAGES=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \) \
  -not -path "*/preview-images/*" 2>/dev/null | while read f; do
  SIZE=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo 0)
  if [ "$SIZE" -gt "$SIZE_LIMIT" ]; then
    SIZE_KB=$((SIZE / 1024))
    echo "  $f (${SIZE_KB}KB)"
  fi
done)

if [ -z "$LARGE_IMAGES" ]; then
  echo "✅ Keine ELEVO-eigenen Bilder >500KB"
else
  echo "❌ Unkomprimierte Bilder >500KB (preview-images ausgeschlossen):"
  echo "$LARGE_IMAGES"
  ERRORS=$((ERRORS + 1))
fi

# Kunden-Preview-Images als Info ausgeben
LARGE_PREVIEW=$(find public/preview-images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) 2>/dev/null | while read f; do
  SIZE=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo 0)
  if [ "$SIZE" -gt "$SIZE_LIMIT" ]; then
    SIZE_KB=$((SIZE / 1024))
    echo "  $f (${SIZE_KB}KB)"
  fi
done || true)

if [ -n "$LARGE_PREVIEW" ]; then
  PREVIEW_COUNT=$(echo "$LARGE_PREVIEW" | wc -l | tr -d ' ')
  echo "ℹ️  $PREVIEW_COUNT Kunden-Preview-Images >500KB (OK fuer Preview-Seiten, ggf. optimieren)"
fi

# 2. Google Fonts CDN-Links pruefen — demos/ ausschliessen (Kunden-Demos nutzen eigene Fonts)
echo "--- Brand-CI: Font-Hosting ---"
FONT_VIOLATIONS=$(grep -r "fonts.googleapis.com\|fonts.gstatic.com" src/ \
  --include="*.astro" --include="*.ts" --include="*.js" \
  -l 2>/dev/null | grep -v "src/pages/demos/" || true)

if [ -z "$FONT_VIOLATIONS" ]; then
  echo "✅ Keine Google Fonts CDN-Links im ELEVO-Hauptprojekt (Fonts korrekt self-hosted)"
else
  echo "❌ Google Fonts CDN in ELEVO-Seiten gefunden — self-hosten (DSGVO):"
  grep -r "fonts.googleapis.com\|fonts.gstatic.com" src/ \
    --include="*.astro" --include="*.ts" --include="*.js" \
    -l 2>/dev/null | grep -v "src/pages/demos/" | while read f; do echo "  $f"; done
  ERRORS=$((ERRORS + 1))
fi

# demos/ nur als Info
DEMO_FONTS=$(grep -r "fonts.googleapis.com" src/pages/demos/ --include="*.astro" -l 2>/dev/null || true)
if [ -n "$DEMO_FONTS" ]; then
  DEMO_COUNT=$(echo "$DEMO_FONTS" | wc -l | tr -d ' ')
  echo "ℹ️  $DEMO_COUNT Kunden-Demo-Dateien nutzen Google Fonts (beabsichtigt fuer Demo-Seiten)"
fi

# 3. Credentials/Secrets im Code
echo "--- Security: Credentials ---"
SECRET_HITS=$(grep -riE \
  "(password|api_key|api_secret|private_key|client_secret)\s*[:=]\s*['\"][^'\"]{6,}['\"]" \
  src/ --include="*.ts" --include="*.js" --include="*.astro" 2>/dev/null \
  | grep -v "\.example" | grep -v "#" | grep -v "ENV\[" || true)

if [ -z "$SECRET_HITS" ]; then
  echo "✅ Keine Credentials im Quellcode erkannt"
else
  echo "❌ Moegliche Credentials im Quellcode:"
  echo "$SECRET_HITS" | head -5
  ERRORS=$((ERRORS + 1))
fi

# 4. Externe Scripts ohne Integrity-Hash
echo "--- Security: Script-Integrity ---"
if [ -d "dist" ]; then
  UNSAFE_SCRIPTS=$(grep -r "<script" dist/ --include="*.html" 2>/dev/null \
    | grep 'src="https\?://' \
    | grep -v 'integrity=' || true)
  if [ -n "$UNSAFE_SCRIPTS" ]; then
    COUNT=$(echo "$UNSAFE_SCRIPTS" | wc -l | tr -d ' ')
    echo "⚠️  $COUNT externe Script-Tags ohne integrity-Attribut"
    echo "   (GTM/Analytics-Scripts sind typischerweise Ausnahme)"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "✅ Keine externen Scripts ohne integrity-Hash"
  fi
fi

# 5. Alt-Texte pruefen (nur ELEVO-Hauptseiten, ohne previews/demos)
echo "--- Accessibility: Alt-Texte ---"
if [ -d "dist" ]; then
  MISSING_ALT=$(find dist -name "*.html" \
    -not -path "*/previews/*" \
    -not -path "*/demos/*" \
    | xargs grep -l "<img" 2>/dev/null \
    | xargs grep -L 'alt=' 2>/dev/null || true)
  if [ -n "$MISSING_ALT" ]; then
    ALT_COUNT=$(echo "$MISSING_ALT" | wc -l | tr -d ' ')
    echo "❌ $ALT_COUNT Seiten mit <img> ohne alt-Attribut:"
    echo "$MISSING_ALT"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ Alle <img>-Tags haben alt-Attribute (Hauptseiten geprueft)"
  fi
fi

# 6. Viewport Meta auf Hauptseiten
echo "--- Responsive: Viewport Meta ---"
if [ -d "dist" ]; then
  MISSING_VIEWPORT=$(find dist -name "*.html" \
    -not -path "*/previews/*" \
    -not -path "*/demos/*" \
    | xargs grep -L 'viewport' 2>/dev/null || true)
  if [ -n "$MISSING_VIEWPORT" ]; then
    echo "❌ Hauptseiten ohne viewport meta:"
    echo "$MISSING_VIEWPORT"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ Viewport-Meta auf allen Hauptseiten vorhanden"
  fi
fi

echo ""
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo "✅ Assets & Security: Alle Checks bestanden"
elif [ "$ERRORS" -eq 0 ]; then
  echo "⚠️  Assets & Security: $WARNINGS Warnungen (keine kritischen Fehler)"
else
  echo "❌ Assets & Security: $ERRORS Fehler, $WARNINGS Warnungen"
  exit 1
fi
