import { getContent } from '../lib/content';
import type { Locale } from '../i18n';

export type ModuleFeature = {
  title: string;
  description: string;
};

export type ProductModule = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  features: ModuleFeature[];
};

export function productModules(locale: Locale): ProductModule[] {
  return getContent(locale).modules.modules;
}

export function findModule(locale: Locale, slug: string): ProductModule | undefined {
  return productModules(locale).find((item) => item.slug === slug);
}
