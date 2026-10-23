import { fallbackLocale, formatDate, type Locale } from '../i18n';

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags?: string[];
  status?: 'draft' | 'published';
  featured?: boolean;
  image?: string;
};

export type BlogPost = {
  slug: string;
  locale: Locale;
  frontmatter: BlogPostFrontmatter;
  Content: unknown;
};

type BlogModule = {
  frontmatter: BlogPostFrontmatter;
  default: unknown;
};

// Posts live in src/content/blog/<locale>/<slug>.md (same slug in every locale).
const modules = import.meta.glob<BlogModule>('../content/blog/*/*.md', { eager: true });

function parsePath(path: string): { locale: string; slug: string } {
  const [locale = '', file = ''] = path.split('/').slice(-2);
  return { locale, slug: file.replace(/\.md$/, '') };
}

function postsOf(locale: Locale): BlogPost[] {
  return Object.entries(modules)
    .map(([path, module]) => ({ ...parsePath(path), module }))
    .filter((entry) => entry.locale === locale)
    .map(({ slug, module }) => ({ slug, locale, frontmatter: module.frontmatter, Content: module.default }));
}

/** Posts of a locale; a slug missing in that locale falls back to its en-US post. */
export function getBlogPosts(locale: Locale, options: { includeDrafts?: boolean } = {}): BlogPost[] {
  const own = postsOf(locale);
  const ownSlugs = new Set(own.map((post) => post.slug));
  const fallback = locale === fallbackLocale ? [] : postsOf(fallbackLocale).filter((post) => !ownSlugs.has(post.slug));

  return [...own, ...fallback]
    .filter((post) => options.includeDrafts || post.frontmatter.status !== 'draft')
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function formatPostDate(locale: Locale, value: string): string {
  return formatDate(locale, value);
}
