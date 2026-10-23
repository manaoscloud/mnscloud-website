import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import settings from './src/content/site/settings.json';

// Locale URL segments: pt-BR is the default (no prefix), en-US under /en/, es-ES under /es/.
// Keep in sync with src/i18n/index.ts.
const localizedSegments = ['en', 'es'];

/** Static servers look for `<dir>/404.html`; emit the localized 404 pages with that name. */
function localizedNotFoundPages() {
  return {
    name: 'mnscloud-localized-404',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const segment of localizedSegments) {
          const source = `${root}${segment}/404/index.html`;
          if (!existsSync(source)) continue;
          renameSync(source, `${root}${segment}/404.html`);
          rmSync(`${root}${segment}/404`, { recursive: true, force: true });
        }
      },
    },
  };
}

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? settings.site?.url ?? 'https://manaos.cloud',
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-BR', en: 'en-US', es: 'es-ES' },
      },
    }),
    localizedNotFoundPages(),
  ],
});
