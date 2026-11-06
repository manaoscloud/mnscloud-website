import type { APIRoute } from 'astro';

/** robots.txt of the static site: everything indexable except the CMS, plus the sitemap index. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? `Sitemap: ${new URL('sitemap-index.xml', site).href}\n` : '';
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n${sitemap}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
