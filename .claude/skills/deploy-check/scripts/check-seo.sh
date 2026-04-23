#!/usr/bin/env bash
# check-seo.sh — Prueft SEO-Meta-Tags in generierten HTML-Dateien

set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

ERRORS=0
WARNINGS=0

echo "=== SEO CHECK ==="

# Pruefe ob dist/ existiert
if [ ! -d "dist" ]; then
  echo "❌ dist/ nicht gefunden — zuerst Build ausfuehren"
  exit 1
fi

# Alle HTML-Dateien finden (ohne Drafts)
HTML_FILES=$(find dist -name "*.html" -not -path "*/demos/*" -not -path "*/previews/*")
TOTAL=$(echo "$HTML_FILES" | wc -l | tr -d ' ')
echo "ℹ️ Pruefe $TOTAL HTML-Dateien..."

for f in $HTML_FILES; do
  PAGE=$(echo "$f" | sed "s|dist/||")
  
  # Title Check
  if ! grep -q "<title>" "$f"; then
    echo "❌ $PAGE: <title> fehlt"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Meta Description
  if ! grep -qi 'meta.*name="description"' "$f"; then
    echo "❌ $PAGE: <meta name="description"> fehlt"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Canonical
  if ! grep -qi 'rel="canonical"' "$f"; then
    echo "⚠️  $PAGE: canonical-Link fehlt"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  # OG Title
  if ! grep -qi 'og:title' "$f"; then
    echo "❌ $PAGE: og:title fehlt"
    ERRORS=$((ERRORS + 1))
  fi
  
  # OG Description
  if ! grep -qi 'og:description' "$f"; then
    echo "❌ $PAGE: og:description fehlt"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo "✅ SEO: Alle $TOTAL Seiten bestanden"
elif [ "$ERRORS" -eq 0 ]; then
  echo "⚠️  SEO: $WARNINGS Warnungen (keine kritischen Fehler)"
else
  echo "❌ SEO: $ERRORS kritische Fehler, $WARNINGS Warnungen"
  exit 1
fi
