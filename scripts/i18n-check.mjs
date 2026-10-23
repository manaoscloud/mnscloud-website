// Translation contract check: every locale has the same keys, no empty strings, and every blog post
// exists in every locale. Run with `npm run check:i18n`.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const locales = ['pt-BR', 'en-US', 'es-ES'];
const referenceLocale = 'en-US';
const problems = [];

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    problems.push({ file, problem: 'invalid-json', message: String(error.message ?? error) });
    return undefined;
  }
}

/** Flattens a JSON value to `path → kind` (arrays record their length so lengths must match). */
function shape(value, path = '', result = new Map(), emptyPaths = []) {
  if (Array.isArray(value)) {
    result.set(path, `array(${value.length})`);
    value.forEach((item, index) => shape(item, `${path}[${index}]`, result, emptyPaths));
  } else if (value !== null && typeof value === 'object') {
    result.set(path || '$', 'object');
    for (const [key, item] of Object.entries(value)) {
      shape(item, path ? `${path}.${key}` : key, result, emptyPaths);
    }
  } else {
    result.set(path, typeof value);
    if (typeof value === 'string' && value.trim() === '') emptyPaths.push(path);
  }
  return { paths: result, emptyPaths };
}

function compareFiles(label, filesByLocale) {
  const shapes = {};
  for (const locale of locales) {
    const file = filesByLocale[locale];
    if (!existsSync(file)) {
      problems.push({ file, problem: 'missing-file', message: `${label} is missing for ${locale}.` });
      continue;
    }
    const json = readJson(file);
    if (json === undefined) continue;
    const { paths, emptyPaths } = shape(json);
    shapes[locale] = paths;
    for (const path of emptyPaths) {
      problems.push({ file, problem: 'empty-string', key: path });
    }
  }

  const reference = shapes[referenceLocale];
  if (!reference) return;
  for (const locale of locales) {
    const current = shapes[locale];
    if (!current || locale === referenceLocale) continue;
    const file = filesByLocale[locale];
    for (const [path, kind] of reference) {
      if (!current.has(path)) problems.push({ file, problem: 'missing-key', key: path, expected: kind });
      else if (current.get(path) !== kind) {
        problems.push({ file, problem: 'shape-mismatch', key: path, expected: kind, actual: current.get(path) });
      }
    }
    for (const path of current.keys()) {
      if (!reference.has(path)) problems.push({ file, problem: 'extra-key', key: path });
    }
  }
}

// 1. UI strings: src/i18n/<locale>.json
compareFiles(
  'UI strings',
  Object.fromEntries(locales.map((locale) => [locale, join(root, 'src/i18n', `${locale}.json`)])),
);

// 2. Editable content: src/content/site/<locale>/<file>.json (file list is the union of all locales).
const contentRoot = join(root, 'src/content/site');
const contentFiles = new Set(
  locales.flatMap((locale) => {
    const dir = join(contentRoot, locale);
    return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.json')) : [];
  }),
);
for (const name of [...contentFiles].sort()) {
  compareFiles(
    `src/content/site/<locale>/${name}`,
    Object.fromEntries(locales.map((locale) => [locale, join(contentRoot, locale, name)])),
  );
}
for (const entry of readdirSync(contentRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !locales.includes(entry.name)) {
    problems.push({ file: join(contentRoot, entry.name), problem: 'unknown-locale-directory' });
  }
}

// 3. Blog posts: src/content/blog/<locale>/<slug>.md, same slugs in every locale.
const blogRoot = join(root, 'src/content/blog');
const slugsByLocale = Object.fromEntries(
  locales.map((locale) => {
    const dir = join(blogRoot, locale);
    const slugs = existsSync(dir)
      ? readdirSync(dir).filter((name) => name.endsWith('.md')).map((name) => name.replace(/\.md$/, ''))
      : [];
    return [locale, new Set(slugs)];
  }),
);
const allSlugs = new Set(Object.values(slugsByLocale).flatMap((slugs) => [...slugs]));
for (const slug of [...allSlugs].sort()) {
  for (const locale of locales) {
    const file = join(blogRoot, locale, `${slug}.md`);
    if (!slugsByLocale[locale].has(slug)) {
      problems.push({ file, problem: 'missing-blog-post', message: `Blog post "${slug}" is missing for ${locale}.` });
      continue;
    }
    const source = readFileSync(file, 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    for (const field of ['title', 'description', 'date', 'author', 'status']) {
      const value = frontmatter.match(new RegExp(`^${field}:\\s*(.*)$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '').trim();
      if (!value) problems.push({ file, problem: 'empty-frontmatter', key: field });
    }
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();
    if (!body) problems.push({ file, problem: 'empty-blog-body' });
  }
}
for (const entry of existsSync(blogRoot) ? readdirSync(blogRoot, { withFileTypes: true }) : []) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    problems.push({ file: join(blogRoot, entry.name), problem: 'blog-post-outside-locale', message: 'Move it to src/content/blog/<locale>/.' });
  }
}

if (problems.length > 0) {
  const report = problems.map((item) => ({ ...item, file: relative(root, item.file) }));
  console.error(JSON.stringify({ ok: false, problems: report }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      locales,
      uiFiles: locales.length,
      contentFiles: [...contentFiles].sort(),
      blogSlugs: [...allSlugs].sort(),
    },
    null,
    2,
  ),
);
