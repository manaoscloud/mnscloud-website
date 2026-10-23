/**
 * Website translation contract (same contract as the MNSCloud App):
 * - locales: pt-BR (default, served at `/`), en-US (`/en/`), es-ES (`/es/`);
 * - en-US is the fallback for any missing key;
 * - UI strings live in `src/i18n/<locale>.json`, editable copy in `src/content/site/<locale>/*.json`;
 * - the visitor's manual choice is stored in localStorage `mc_language` / `mc_language_mode`.
 */
import ptBR from './pt-BR.json';
import enUS from './en-US.json';
import esES from './es-ES.json';

export const locales = ['pt-BR', 'en-US', 'es-ES'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';
export const fallbackLocale: Locale = 'en-US';

/** URL segment per locale; the default locale has no prefix. */
export const localeSegments: Record<Locale, string | undefined> = {
  'pt-BR': undefined,
  'en-US': 'en',
  'es-ES': 'es',
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  'en-US': 'en_US',
  'es-ES': 'es_ES',
};

export const languageStorageKey = 'mc_language';
export const languageModeStorageKey = 'mc_language_mode';

type Dictionary = { [key: string]: string | Dictionary };

const dictionaries: Record<Locale, Dictionary> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Locale for a `[...lang]` route param (`undefined` → default locale). */
export function localeFromParam(lang: string | undefined): Locale {
  if (!lang) return defaultLocale;
  const match = locales.find((locale) => localeSegments[locale] === lang);
  return match ?? defaultLocale;
}

/** `getStaticPaths` params for every locale of a `[...lang]` route. */
export function localeParams(): { params: { lang: string | undefined }; props: { locale: Locale } }[] {
  return locales.map((locale) => ({ params: { lang: localeSegments[locale] }, props: { locale } }));
}

/** Splits a pathname into its locale and the locale-neutral path (always starting with `/`). */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const [, first = '', ...rest] = pathname.split('/');
  const locale = locales.find((item) => localeSegments[item] && localeSegments[item] === first);
  if (!locale) return { locale: defaultLocale, path: pathname || '/' };
  return { locale, path: `/${rest.join('/')}` };
}

export function localeFromUrl(url: URL): Locale {
  return splitLocalePath(url.pathname).locale;
}

function lookup(dictionary: Dictionary, key: string): string | undefined {
  let node: string | Dictionary | undefined = dictionary;
  for (const part of key.split('.')) {
    if (!node || typeof node === 'string') return undefined;
    node = node[part];
  }
  return typeof node === 'string' && node !== '' ? node : undefined;
}

/** Translates a UI key, falling back to en-US and then to the key itself. */
export function t(locale: Locale, key: string, params: Record<string, string | number> = {}): string {
  const template = lookup(dictionaries[locale], key) ?? lookup(dictionaries[fallbackLocale], key) ?? key;
  return template.replace(/\{\{?\s*(\w+)\s*\}?\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** Paths served outside the localized page tree (API, admin, static assets). */
const unlocalizedPrefixes = ['/api/', '/admin', '/brand/', '/uploads/', '/sitemap', '/robots.txt'];

/**
 * Prefixes an internal site path with the locale segment. External URLs, `mailto:`/`tel:` links,
 * in-page anchors (`#...`), API/admin/asset paths and file paths are returned unchanged.
 */
export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (unlocalizedPrefixes.some((prefix) => path.startsWith(prefix))) return path;
  const segment = localeSegments[locale];
  if (!segment) return path;
  return path === '/' ? `/${segment}/` : `/${segment}${path}`;
}

/** The same page in every locale, for hreflang links and the language switcher. */
export function alternates(path: string): { locale: Locale; href: string }[] {
  const split = splitLocalePath(path).path;
  // Not-found pages have no translated counterpart at the same URL: offer each locale's home.
  const neutral = /^\/404(\.html|\/)?$/.test(split) ? '/' : split;
  return locales.map((locale) => ({ locale, href: localizePath(locale, neutral) }));
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function isPlainObject(value: unknown): value is Record<string, Json> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep merge used for the en-US fallback of editable content (arrays are replaced, not merged). */
export function withFallback<T>(fallback: T, value: unknown): T {
  if (value === undefined || value === null || value === '') return fallback;
  if (isPlainObject(fallback) && isPlainObject(value)) {
    const result: Record<string, unknown> = { ...fallback };
    for (const [key, item] of Object.entries(value)) {
      result[key] = key in fallback ? withFallback((fallback as Record<string, unknown>)[key], item) : item;
    }
    return result as T;
  }
  return value as T;
}

export function formatDate(locale: Locale, value: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value));
}
