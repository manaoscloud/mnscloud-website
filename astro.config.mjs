import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.manaoscloud.com',
  integrations: [sitemap()],
});
