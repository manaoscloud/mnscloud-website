import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const officialDomainPatterns = [/manaos\.cloud/i, /manaoscloud\.com/i];
const allowedOfficialDomainFiles = new Set([
  'astro.config.mjs',
  'README.md',
  'src/content/site/settings.json',
]);

const skippedDirectories = new Set(['.astro', '.git', 'dist', 'node_modules']);
const checkedExtensions = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.mjs',
  '.md',
  '.ts',
  '.yml',
  '.yaml',
]);

function extensionOf(path) {
  const index = path.lastIndexOf('.');
  return index >= 0 ? path.slice(index) : '';
}

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    if (skippedDirectories.has(entry)) continue;

    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (checkedExtensions.has(extensionOf(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

const problems = [];

for (const file of walk(root)) {
  const rel = relative(root, file);
  const content = readFileSync(file, 'utf8');

  if (
    officialDomainPatterns.some((pattern) => pattern.test(content)) &&
    !allowedOfficialDomainFiles.has(rel)
  ) {
    problems.push({
      file: rel,
      problem: 'official-domain-hardcoded',
      message:
        'Official domains may only be hardcoded in site settings, Astro fallback config, or documentation examples.',
    });
  }

  if (rel === 'public/admin/config.yml') {
    if (!/site_url:\s*["']\/["']/.test(content)) {
      problems.push({
        file: rel,
        problem: 'admin-site-url-not-relative',
        message: 'Decap site_url must stay relative as "/" for domain-independent admin navigation.',
      });
    }

    if (!/display_url:\s*["']\/["']/.test(content)) {
      problems.push({
        file: rel,
        problem: 'admin-display-url-not-relative',
        message: 'Decap display_url must stay relative as "/" for domain-independent admin navigation.',
      });
    }
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ ok: false, problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true }, null, 2));
