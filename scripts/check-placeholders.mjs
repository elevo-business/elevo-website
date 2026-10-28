#!/usr/bin/env node
// Listet alle offenen Platzhalter der Landingpage /familienrecht auf (Briefing, Abschnitt 10 + 13):
//  - Texte mit [eckigen Klammern] bzw. [NEED: …] in src/config/familienrecht.json
//  - leere technische IDs (HubSpot-formGuid, Meta-Pixel-ID)
//  - fehlende Dateien (OG-Bild, Logos)
// Aufruf: bun run check:placeholders  (oder npm run check:placeholders). Exit-Code 1, solange etwas offen ist.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLACEHOLDER = /\[[^\]]+\]/;
const CONFIG = 'src/config/familienrecht.json';

function collect(value, path, out) {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value)) out.push(`${path}: ${value}`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collect(v, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collect(v, path ? `${path}.${k}` : k, out);
  }
}

export function findOpenItems(root = process.cwd()) {
  const config = JSON.parse(readFileSync(join(root, CONFIG), 'utf8'));
  const open = [];
  collect(config, '', open);

  const empty = (value) => typeof value !== 'string' || value.trim() === '';
  if (empty(config.form?.hubspot?.formGuid)) open.push('form.hubspot.formGuid: leer (HubSpot-Formular anlegen, ID eintragen)');
  if (empty(config.tracking?.metaPixelId)) open.push('tracking.metaPixelId: leer (ohne ID lädt kein Pixel)');

  const files = [
    ['seo.ogImage', config.seo?.ogImage],
    ...(config.results?.items ?? []).map((item, i) => [`results.items[${i}].image`, item.image]),
  ];
  for (const [path, file] of files) {
    if (file && !existsSync(join(root, 'public', file))) open.push(`${path}: Datei fehlt (public${file})`);
  }
  return open;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const open = findOpenItems();
  if (open.length === 0) {
    console.log(`Keine offenen Platzhalter in ${CONFIG}.`);
  } else {
    console.log(`${open.length} offene Platzhalter in ${CONFIG}:`);
    for (const line of open) console.log(`  • ${line}`);
    process.exitCode = 1;
  }
}
