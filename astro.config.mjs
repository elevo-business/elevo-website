// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import placeholderReport from './src/neukundensystem/integrations/placeholder-report.mjs';

export default defineConfig({
  site: 'https://elevo.solutions',
  integrations: [
    // noindex-Seiten gehören nicht in die Sitemap: Danke-/Absage-Seiten, Ads-Landingpages, Kunden-Previews und
    // weitere Seiten mit robots noindex (funnel-check, vertriebssystem, webseite-aachen)
    sitemap({
      filter: (page) =>
        !/\/(danke|absage)\/|\/(familienrecht|kanzlei-anleitung|kanzlei-berlin|previews|funnel-check|vertriebssystem|webseite-aachen)\//.test(page),
    }),
    placeholderReport(),
  ],
  output: 'static',
  // Tailwind wird nur von der Startseite und den Landingpages /neukundensystem, /familienrecht, /kanzlei-anleitung und /kanzlei-berlin genutzt (je eigene CSS-Datei mit source(none))
  vite: { plugins: [tailwindcss()] },
});
