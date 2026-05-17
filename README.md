# MNSCloud Website

Public marketing and product website for MNSCloud.

This repository is intentionally separate from the administrative Angular app. It is a public,
static-first website focused on product positioning, modules, security posture, developer ecosystem,
and commercial contact flows.

## Stack

- Astro
- TypeScript
- Static output by default

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Website Admin

The website includes a git-based admin surface powered by Decap CMS:

```text
/admin
```

The admin edits repository content instead of writing to a database. Blog posts are stored as
Markdown files in `src/content/blog/`, uploaded media is stored in `public/uploads/`, and every
published change can be reviewed through Git history or Pull Requests depending on the GitHub
backend configuration.

Editable site content is stored in:

```text
src/content/site/settings.json
src/content/site/home.json
src/content/site/modules.json
src/content/site/pages.json
src/content/site/modulePages.json
src/content/blog/
```

The admin exposes collections for global settings, navigation, CTAs, the home page, product modules,
module detail pages, core pages, media, and blog posts. Any page or component that should be
marketing-editable must read from these content files instead of hardcoding copy in Astro
components.

For local CMS testing, run Decap's local backend in one terminal and the Astro dev server in another:

```bash
npm run cms
npm run dev
```

Then open `http://localhost:4321/admin`.

Production authentication is handled by the configured GitHub backend/OAuth provider. Do not add
GitHub tokens, OAuth secrets, customer data, private domains, or infrastructure details to this
repository.

### Admin access model

There is no default username/password. That is intentional.

The admin writes to Git, so production access is controlled by GitHub:

1. Invite the maintainer to the `manaoscloud/mnscloud-website` repository or to the correct GitHub
   team.
2. Give the minimum permission needed for the role.
3. The maintainer signs in through the configured GitHub OAuth/Git Gateway flow.
4. Content changes are committed through the CMS/editorial workflow and remain reviewable in Git.

This avoids shipping password hashes, user tables, reset flows, or permanent credentials in the
public website repository. If MNSCloud later needs local username/password accounts, that should be a
separate private identity service or API-backed admin, not static website code.

### Partner/self-hosted deployments

A partner may build the website and host the generated `dist/` files on their own server, CDN, or
static hosting provider. The public pages will work as static HTML/CSS/JS.

The public site URL can be configured in two places:

- `src/content/site/settings.json`, used by rendered pages, metadata, and as the default Astro site
  URL.
- `PUBLIC_SITE_URL` at build time, used as an explicit deployment override for sitemap/canonical
  generation.

Example:

```bash
PUBLIC_SITE_URL=https://partner.example.com npm run build
```

For partner white-label deployments, update the CMS-controlled site settings first:

```json
{
  "site": {
    "url": "https://partner.example.com",
    "supportEmail": "support@partner.example.com"
  }
}
```

The `/admin` screen is different: it is only the editor UI. To save content changes, it still needs a
writable Git backend and authentication provider.

Recommended partner flow:

1. Fork or clone `manaoscloud/mnscloud-website` into the partner's GitHub organization.
2. Update `public/admin/config.yml` so `backend.repo` points to the partner repository.
3. Update `site_url` and `display_url` in `public/admin/config.yml` to the partner's public domain.
4. Configure the Decap CMS GitHub OAuth/Git Gateway provider for the partner domain.
5. Add marketing users as GitHub collaborators or members of a GitHub team with the minimum required
   repository permission.
6. Editors access `/admin`, authenticate through GitHub/OAuth, and create content through the
   editorial workflow.
7. A build/deploy pipeline publishes the updated static `dist/` output to the partner server/CDN.

### White-label editing coverage

The admin is intended to let a partner launch quickly without rewriting the site. These areas must
remain editable from `/admin`:

- Global identity: public URL, default metadata, support email, API base URL, GitHub organization,
  repository URL, API docs URL, logo labels, and favicon/OG image paths.
- Navigation: header links, primary CTA, secondary CTA, footer columns, legal links, and social
  links.
- Home page: hero, trust signals, module cards, architecture section, blog section, and final CTA.
- Product structure: module cards and module detail pages for VoIP, Hosting, Monitoring,
  Cyber Security, and Support.
- Core pages: API docs, developers, security, contact, and blog landing copy.
- Blog posts and uploaded public media.

The following values are intentionally not managed by CMS content because they are deployment or
repository concerns that the CMS must know before it can load:

- `public/admin/config.yml` `backend.repo`
- `public/admin/config.yml` `site_url`
- `public/admin/config.yml` `display_url`
- OAuth/Git Gateway provider configuration
- CI/CD deployment secrets and hosting credentials

When adding new marketing pages, add their copy to `src/content/site/*.json` or blog Markdown and
then expose the fields in `public/admin/config.yml`. Do not hardcode partner-editable text directly
inside Astro pages.

If a partner requires standalone username/password accounts managed outside GitHub, that is no
longer a purely static git-based CMS. It should be implemented as an API-backed private admin or a
self-hosted headless CMS with database-backed users, roles, sessions, password reset, audit logs,
and deployment webhooks.

## Build

```bash
npm run build
```

Static output is generated in `dist/`.

## Responsive Validation

The public website must be fully responsive before release. The header, CTAs, cards, module pages,
blog, docs, and contact pages must work without horizontal document overflow at mobile, tablet, and
desktop widths.

Run the automated viewport check with the Astro dev server running:

```bash
npm run dev
npm run check:responsive
```

The check currently validates the primary public pages at `320px`, `390px`, `768px`, and `1440px`.
If a new public page is added, include it in `scripts/responsive-check.mjs`.

## Blog

Blog posts are static Markdown content:

```text
src/content/blog/<slug>.md
```

Each post must include frontmatter with `title`, `description`, `date`, `author`, `tags`, `status`,
and optional `featured`/`image` fields. Published posts are generated under `/blog/<slug>/` and are
included in the static build and sitemap.

## Brand Assets

Approved brand files belong in:

```text
public/brand/
```

Current working assets:

- `mnscloud-logo.png`
- `mnscloud-logo-light.png`
- `mnscloud-wordmark-orange.png`
- `mnscloud-wordmark-green.png`
- `mnscloud-wordmark-stacked-green.png`
- `mnscloud-watermark.png`
- `favicon.png`

The current implementation follows `brand_manual.pdf`: Safety Orange `#F5832E`, Hunter Green
`#1D5B31`, Montserrat for body text, Oswald for titles, and clear-space/proportion rules for logo
usage. Preserve public-safe metadata only.

## Public Boundary

This website is public. Do not add secrets, customer data, production infrastructure details,
provider credentials, database credentials, private business rules, or API-side authorization logic.

Future API integrations, such as contact forms or demo requests, must use public API endpoints with
server-side validation.
