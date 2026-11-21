import shared from '../content/site/settings.json';
import enSettings from '../content/site/en-US/settings.json';
import enHome from '../content/site/en-US/home.json';
import enModules from '../content/site/en-US/modules.json';
import enPages from '../content/site/en-US/pages.json';
import enModulePages from '../content/site/en-US/modulePages.json';
import enLegal from '../content/site/en-US/legal.json';
import { fallbackLocale, withFallback, type Locale } from '../i18n';

/** Shape of every locale's content: the en-US files are the reference (and the fallback). */
const reference = {
  settings: enSettings,
  home: enHome,
  modules: enModules,
  pages: enPages,
  modulePages: enModulePages,
  legal: enLegal,
};

export type SiteContent = typeof reference;
type ContentFile = keyof SiteContent;

const files = import.meta.glob<{ default: unknown }>('../content/site/*/*.json', { eager: true });

function rawFile(locale: Locale, name: ContentFile): unknown {
  return files[`../content/site/${locale}/${name}.json`]?.default;
}

const cache = new Map<Locale, SiteContent>();

/** Editable copy for a locale, with missing keys taken from en-US. */
export function getContent(locale: Locale): SiteContent {
  const cached = cache.get(locale);
  if (cached) return cached;
  const content = Object.fromEntries(
    (Object.keys(reference) as ContentFile[]).map((name) => [
      name,
      locale === fallbackLocale ? reference[name] : withFallback(reference[name], rawFile(locale, name)),
    ]),
  ) as SiteContent;
  cache.set(locale, content);
  return content;
}

/** Locale-neutral identity values (site URL, brand assets) shared by every locale. */
export const siteShared = shared;

/**
 * Same-origin path of the web chat loader (the MNSCloud API serves the chat configured for this
 * website's domain, or an empty script). `PUBLIC_WEBCHAT_LOADER` overrides it; empty disables it,
 * and a self-hosted copy without the API only gets a harmless 404 for the script.
 */
export function webchatLoader(): string | null {
  const configured =
    import.meta.env.PUBLIC_WEBCHAT_LOADER ??
    (shared as { integrations?: { webchatLoader?: string } }).integrations?.webchatLoader ??
    '';
  const path = String(configured).trim();
  return /^\/(?!\/)[A-Za-z0-9._~\/-]+\.js$/.test(path) ? path : null;
}

export function siteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL ?? shared.site.url;
}
