// Listet beim Build alle noch offenen [Platzhalter] aus src/config/site.json und src/config/familienrecht.json auf.
// Der Build bricht dabei nicht ab – die Liste ist eine Erinnerung vor dem Go-live.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { findOpenItems as findFamilienrechtItems } from '../../../scripts/check-placeholders.mjs';

const PLACEHOLDER = /\[[^\]]+\]/;

function collect(value, path, out) {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value)) out.push(`${path}: ${value}`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collect(v, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (!k.startsWith('_')) collect(v, path ? `${path}.${k}` : k, out);
    }
  }
}

export default function placeholderReport() {
  return {
    name: 'placeholder-report',
    hooks: {
      'astro:build:done': ({ logger }) => {
        const root = process.cwd();
        const familienrecht = findFamilienrechtItems(root);
        if (familienrecht.length > 0) {
          logger.warn(`${familienrecht.length} offene Platzhalter in src/config/familienrecht.json (bun run check:placeholders):`);
          for (const line of familienrecht) logger.warn(`  • ${line}`);
        }
        const site = JSON.parse(readFileSync(join(root, 'src/config/site.json'), 'utf8'));
        const open = [];
        collect(site, '', open);
        if (site.vsl?.provider === 'self' && !existsSync(join(root, 'public', site.vsl.src))) {
          open.push(`vsl.src: Videodatei fehlt (public${site.vsl.src})`);
        }
        if (open.length === 0) {
          logger.info('Keine offenen Platzhalter in site.json.');
          return;
        }
        logger.warn(`${open.length} offene Platzhalter in src/config/site.json:`);
        for (const line of open) logger.warn(`  • ${line}`);
      },
    },
  };
}
