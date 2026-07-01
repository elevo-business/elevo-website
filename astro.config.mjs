// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elevo.solutions',
  integrations: [
    sitemap({
      // Preview- und Demo-Seiten sind noindex und gehören nicht in die Sitemap.
      filter: (page) => !page.includes('/previews/') && !page.includes('/demos/'),
    }),
  ],
  output: 'static',
});
