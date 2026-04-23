#!/usr/bin/env bash
# check-build.sh — Prueft ob der Astro-Build erfolgreich durchlaeuft

set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

echo "=== BUILD CHECK ==="

if bun run build 2>&1; then
  echo "BUILD_OK=true"
  echo "✅ Build erfolgreich (bun run build)"
else
  echo "BUILD_OK=false"
  echo "❌ Build fehlgeschlagen"
  exit 1
fi

# Pruefe ob dist/ existiert und nicht leer ist
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
  FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
  echo "✅ dist/ vorhanden ($FILE_COUNT Dateien generiert)"
else
  echo "❌ dist/ fehlt oder ist leer"
  exit 1
fi
