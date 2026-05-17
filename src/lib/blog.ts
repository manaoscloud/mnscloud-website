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
  frontmatter: BlogPostFrontmatter;
  Content: unknown;
};

type BlogModule = {
  frontmatter: BlogPostFrontmatter;
  default: unknown;
};

const modules = import.meta.glob<BlogModule>('../content/blog/*.md', { eager: true });

function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path;
}

export function getBlogPosts(options: { includeDrafts?: boolean } = {}): BlogPost[] {
  return Object.entries(modules)
    .map(([path, module]) => ({
      slug: slugFromPath(path),
      frontmatter: module.frontmatter,
      Content: module.default,
    }))
    .filter((post) => options.includeDrafts || post.frontmatter.status !== 'draft')
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });
}

export function formatPostDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
}
