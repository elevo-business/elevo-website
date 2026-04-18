// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elevo.solutions',
  integrations: [sitemap()],
  output: 'static',
});
