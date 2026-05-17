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

The `/admin` screen is different: it is only the editor UI. To save content changes, it still needs a
writable Git backend and authentication provider.

Recommended partner flow:

1. Fork or clone `manaoscloud/mnscloud-website` into the partner's GitHub organization.
2. Update `public/admin/config.yml` so `backend.repo` points to the partner repository.
3. Configure the Decap CMS GitHub OAuth/Git Gateway provider for the partner domain.
4. Add marketing users as GitHub collaborators or members of a GitHub team with the minimum required
   repository permission.
5. Editors access `/admin`, authenticate through GitHub/OAuth, and create content through the
   editorial workflow.
6. A build/deploy pipeline publishes the updated static `dist/` output to the partner server/CDN.

If a partner requires standalone username/password accounts managed outside GitHub, that is no
longer a purely static git-based CMS. It should be implemented as an API-backed private admin or a
self-hosted headless CMS with database-backed users, roles, sessions, password reset, audit logs,
and deployment webhooks.

## Build

```bash
npm run build
```

Static output is generated in `dist/`.

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
