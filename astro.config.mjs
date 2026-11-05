// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import placeholderReport from './src/neukundensystem/integrations/placeholder-report.mjs';

export default defineConfig({
  site: 'https://elevo.solutions',
  integrations: [
    // noindex-Seiten gehören nicht in die Sitemap: /neukundensystem/danke + /absage, /familienrecht und /kanzlei-anleitung (nur Ads-Traffic)
    sitemap({ filter: (page) => !/\/neukundensystem\/(danke|absage)|\/familienrecht\/|\/kanzlei-anleitung\//.test(page) }),
    placeholderReport(),
  ],
  output: 'static',
  // Tailwind wird nur von den Landingpages /neukundensystem, /familienrecht und /kanzlei-anleitung genutzt (je eigene CSS-Datei mit source(none))
  vite: { plugins: [tailwindcss()] },
});
