import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import settings from './src/content/site/settings.json';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? settings.site?.url ?? 'https://manaos.cloud',
  integrations: [sitemap()],
});
