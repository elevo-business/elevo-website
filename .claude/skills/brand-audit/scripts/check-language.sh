#!/usr/bin/env bash
# ELEVO Brand-CI: Sprach- und Ton-Check

set -euo pipefail

PROJ_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SRC="$PROJ_ROOT/src"

echo "## 🗣️ Sprache & Ton-Check"
echo ""

VIOLATIONS=0

CUSTOMER_FACING_DIRS=(
  "$SRC/pages"
  "$SRC/components"
  "$SRC/layouts"
)

# 1. Externe Tool-/Firmennamen
echo "### Tool-/Firmennamen Check"
FORBIDDEN_TOOLS=(
  "Coolify"
  "Zapier"
  "Paperclip"
  "Netcup"
  "Anthropic"
  "ChatGPT"
  "Hetzner"
)

TOOL_VIOLATIONS=0
for dir in "${CUSTOMER_FACING_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi

  for tool in "${FORBIDDEN_TOOLS[@]}"; do
    while IFS= read -r match; do
      file=$(echo "$match" | cut -d: -f1)
      line=$(echo "$match" | cut -d: -f2)
      content_part=$(echo "$match" | cut -d: -f3-)
      # Kommentare und Import-Zeilen überspringen
      if echo "$content_part" | grep -qE "^[[:space:]]*(import|//|const|let|var|<!--)" 2>/dev/null; then
        continue
      fi
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ Tool-Name '$tool' in Output — $rel_file:$line"
      ((TOOL_VIOLATIONS++)) || true
      ((VIOLATIONS++)) || true
    done < <(grep -rn "$tool" "$dir" --include="*.astro" --include="*.html" 2>/dev/null | grep -v "node_modules" || true)
  done
done

if [[ "$TOOL_VIOLATIONS" -eq 0 ]]; then
  echo "✅ Keine externen Tool-/Firmennamen in kundenvisiblen Dateien"
fi

# 2. "Ich"-Form
echo ""
echo "### Ansprache-Form (Wir statt Ich)"
ICH_VIOLATIONS=0
ICH_PATTERNS=(
  "Ich bin"
  "ich biete"
  "ich entwickle"
  "ich helfe"
  "ich erstelle"
  "mein Angebot"
  "meine Leistungen"
  "meine Kunden"
)

for dir in "${CUSTOMER_FACING_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi

  for pattern in "${ICH_PATTERNS[@]}"; do
    while IFS= read -r match; do
      file=$(echo "$match" | cut -d: -f1)
      line=$(echo "$match" | cut -d: -f2)
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ 'Ich'-Form: '$pattern' — $rel_file:$line"
      ((ICH_VIOLATIONS++)) || true
      ((VIOLATIONS++)) || true
    done < <(grep -rni "$pattern" "$dir" --include="*.astro" --include="*.html" 2>/dev/null | grep -v "node_modules" || true)
  done
done

if [[ "$ICH_VIOLATIONS" -eq 0 ]]; then
  echo "✅ 'Wir'-Form korrekt — keine 'Ich'-Ansprache gefunden"
fi

# 3. Englische Placeholder-WERTE (nicht das Attribut selbst)
echo ""
echo "### Englische Placeholder-Werte"
EN_PLACEHOLDER_VIOLATIONS=0
# Suche nach placeholder="..." wo der Wert englisch ist
ENGLISH_PLACEHOLDER_PATTERNS=(
  'placeholder="Your'
  'placeholder="Enter'
  'placeholder="Type'
  'placeholder="Search'
  'placeholder="First name'
  'placeholder="Last name'
  'placeholder="Email address'
  'placeholder="Phone number'
  'placeholder="Message'
  "placeholder='Your"
  "placeholder='Enter"
)

for dir in "${CUSTOMER_FACING_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi

  for pattern in "${ENGLISH_PLACEHOLDER_PATTERNS[@]}"; do
    while IFS= read -r match; do
      file=$(echo "$match" | cut -d: -f1)
      line=$(echo "$match" | cut -d: -f2)
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ Englischer Placeholder-Text — $rel_file:$line"
      ((EN_PLACEHOLDER_VIOLATIONS++)) || true
      ((VIOLATIONS++)) || true
    done < <(grep -rni "$pattern" "$dir" --include="*.astro" --include="*.html" 2>/dev/null | grep -v "node_modules" || true)
  done
done

# Weitere englische Standard-Texte (im sichtbaren HTML-Inhalt)
ENGLISH_CONTENT_PATTERNS=(
  "Hello World"
  "Lorem ipsum"
  "Click here"
  "Read more"
  "Get started"
  "coming soon"
  "Coming Soon"
)

for dir in "${CUSTOMER_FACING_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi

  for pattern in "${ENGLISH_CONTENT_PATTERNS[@]}"; do
    while IFS= read -r match; do
      file=$(echo "$match" | cut -d: -f1)
      line=$(echo "$match" | cut -d: -f2)
      content_part=$(echo "$match" | cut -d: -f3-)
      if echo "$content_part" | grep -qE "^[[:space:]]*(import|//|const|let)" 2>/dev/null; then
        continue
      fi
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ Englischer Text '$pattern' — $rel_file:$line"
      ((EN_PLACEHOLDER_VIOLATIONS++)) || true
      ((VIOLATIONS++)) || true
    done < <(grep -rn "$pattern" "$dir" --include="*.astro" --include="*.html" 2>/dev/null | grep -v "node_modules" || true)
  done
done

if [[ "$EN_PLACEHOLDER_VIOLATIONS" -eq 0 ]]; then
  echo "✅ Keine englischen Texte / Placeholder-Werte gefunden"
fi

# 4. Dark-Only Check
echo ""
echo "### Dark-Only Check"
LIGHT_VIOLATIONS=0
LIGHT_PATTERNS=(
  "prefers-color-scheme.*light"
  'class="light-mode"'
  'class="light_theme"'
)

for dir in "${CUSTOMER_FACING_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then continue; fi

  for pattern in "${LIGHT_PATTERNS[@]}"; do
    while IFS= read -r match; do
      file=$(echo "$match" | cut -d: -f1)
      line=$(echo "$match" | cut -d: -f2)
      rel_file="${file#$PROJ_ROOT/}"
      echo "❌ Light-Mode Code — $rel_file:$line"
      ((LIGHT_VIOLATIONS++)) || true
      ((VIOLATIONS++)) || true
    done < <(grep -rniE "$pattern" "$dir" --include="*.css" --include="*.astro" 2>/dev/null | grep -v "node_modules" || true)
  done
done

if [[ "$LIGHT_VIOLATIONS" -eq 0 ]]; then
  echo "✅ Kein Light-Mode Code gefunden"
fi

echo ""
if [[ "$VIOLATIONS" -eq 0 ]]; then
  echo "✅ **Sprache & Ton:** Alle Checks bestanden"
else
  echo "❌ **Sprache & Ton:** $VIOLATIONS Problem(e) gefunden"
fi

[[ "$VIOLATIONS" -eq 0 ]]
