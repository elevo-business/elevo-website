#!/usr/bin/env node
// Listet alle offenen Platzhalter der Startseite (src/config/startseite.json) und der Landingpage
// /familienrecht (src/config/familienrecht.json) auf:
//  - Texte mit [eckigen Klammern] bzw. [NEED: …]
//  - leere technische IDs (HubSpot-formGuid, Meta-Pixel-ID, Video-ID)
//  - fehlende Dateien (OG-Bild, Logos, Video-Poster)
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

const STARTSEITE = 'src/config/startseite.json';

export function findStartseiteItems(root = process.cwd()) {
  const config = JSON.parse(readFileSync(join(root, STARTSEITE), 'utf8'));
  const open = [];
  collect(config, '', open);

  const empty = (value) => typeof value !== 'string' || value.trim() === '';
  if (empty(config.form?.hubspot?.formGuid)) open.push('form.hubspot.formGuid: leer (HubSpot-Formular „Startseite“ anlegen, ID eintragen)');
  if (empty(config.video?.videoId)) open.push('video.videoId: leer (ohne ID wird das Thesis-Video nicht angezeigt)');
  if (config.video?.provider === 'bunny' && empty(config.video?.bunnyLibraryId)) open.push('video.bunnyLibraryId: leer');
  if (empty(config.tracking?.metaPixelId)) open.push('tracking.metaPixelId: leer (ohne ID lädt kein Pixel)');
  for (const [path, file] of [['seo.ogImage', config.seo?.ogImage], ['video.poster', config.video?.poster]]) {
    if (file && !existsSync(join(root, 'public', file))) open.push(`${path}: Datei fehlt (public${file})`);
  }
  return open;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let total = 0;
  for (const [file, find] of [[STARTSEITE, findStartseiteItems], [CONFIG, findOpenItems]]) {
    const open = find();
    total += open.length;
    if (open.length === 0) {
      console.log(`Keine offenen Platzhalter in ${file}.`);
    } else {
      console.log(`${open.length} offene Platzhalter in ${file}:`);
      for (const line of open) console.log(`  • ${line}`);
    }
  }
  if (total > 0) process.exitCode = 1;
}
