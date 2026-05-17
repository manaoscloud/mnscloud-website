import modulesData from '../content/site/modules.json';

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

export const productModules: ProductModule[] = modulesData.modules;

export function findModule(slug: string): ProductModule | undefined {
  return productModules.find((item) => item.slug === slug);
}
