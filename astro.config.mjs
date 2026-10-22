// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import placeholderReport from './src/neukundensystem/integrations/placeholder-report.mjs';

export default defineConfig({
  site: 'https://elevo.solutions',
  integrations: [
    // /neukundensystem/danke ist noindex und gehört nicht in die Sitemap
    sitemap({ filter: (page) => !page.includes('/neukundensystem/danke') }),
    placeholderReport(),
  ],
  output: 'static',
  // Tailwind wird nur von der Landingpage /neukundensystem genutzt (eigene CSS-Datei mit source(none))
  vite: { plugins: [tailwindcss()] },
});
