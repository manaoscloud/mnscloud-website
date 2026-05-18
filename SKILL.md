# MNSCloud Website Skill

Use this repository for the public MNSCloud website.

## Purpose

- Present MNSCloud modules, architecture, security posture, and developer ecosystem.
- Stay separate from the Angular administrative app.
- Be safe for public repositories and external contributors.

## Design Rules

- Use approved brand assets from `public/brand/`.
- Follow `brand_manual.pdf` when choosing logo variants, colors, typography, and clear space.
- Use Safety Orange `#F5832E` and Hunter Green `#1D5B31`.
- Use Montserrat for subtitles/body text and Oswald for titles.
- Do not rotate, distort, recolor, add shadows, add textures, alter letter spacing, or change the
  CLOUD tag position.
- The first viewport must communicate MNSCloud as the main brand.
- Keep pages direct and product-focused, not generic marketing filler.
- Avoid private customer data, internal topology, private domains, production IPs, or credentials.

## Engineering Rules

- Use Astro components and static pages by default.
- Keep JavaScript minimal unless a workflow needs interactivity.
- Public pages must be fully responsive at small mobile, large mobile, tablet, and desktop widths.
- Do not solve mobile navigation with horizontal page overflow. Use responsive layouts, wrapping,
  or an explicit mobile menu.
- When adding public pages, include them in `scripts/responsive-check.mjs`.
- Future forms must submit only to public API endpoints with server-side validation.
- Keep documentation and public text in English unless a localized route is explicitly being added.
- Blog and marketing content should be stored as Markdown/frontmatter, not in a database.
- Marketing-editable site copy must live in `src/content/site/*.json` or `src/content/blog/*.md`;
  avoid hardcoding editable business copy directly inside Astro pages.
- Partner deployments must be able to set their own public domain with
  `src/content/site/settings.json`; `PUBLIC_SITE_URL` is an optional deployment override.
- Canonical and Open Graph URLs must use `PUBLIC_SITE_URL` when provided and fall back to
  `src/content/site/settings.json`.
- Do not hardcode official Manaos domains in components, pages, admin config, navigation, or public
  scripts. Use relative URLs for internal navigation and content/admin settings for configurable
  public URLs.
- Keep white-label content editable through `/admin`: brand metadata, support/API URLs, navigation,
  footer, CTAs, home sections, module cards, module detail pages, proof/trust pages, core pages,
  blog posts, and public media.
- Keep CMS boot/deployment concerns outside CMS-managed content: Decap `backend.repo`, OAuth/Git
  Gateway configuration, CI/CD secrets, and hosting credentials are changed per
  repository/deployment before the admin loads.
- Keep Decap `site_url` and `display_url` relative as `/` by default so admin navigation returns to
  the current deployed domain instead of the official Manaos domain.
- When a new page or section is meant for partners to customize, add the source fields under
  `src/content/site/*.json` or `src/content/blog/*.md` and expose them in
  `public/admin/config.yml`; do not hardcode partner-editable copy in Astro pages.
- The admin surface is git-based Decap CMS under `/admin`; do not introduce permanent secrets or
  private infrastructure data into CMS-managed content.
- Uploaded public website media belongs in `public/uploads/` and must be safe for public CDN
  distribution.
- New blog posts must define SEO-ready `title`, `description`, `date`, `author`, `tags`, and
  `status` frontmatter.
- Trust/legal pages live in `src/content/site/legal.json` and must remain editable through Decap CMS.
- Public proof pages such as architecture, company, use cases, status, changelog, and FAQ live in
  `src/content/site/pages.json` and must remain editable through Decap CMS.
- Cookie consent must default to necessary-only behavior. Do not load analytics, marketing,
  tracking, chat, embedded widgets, or other non-essential scripts until the relevant consent
  category has been accepted.
- Legal templates are not final legal advice. Production legal text must be reviewed by qualified
  legal counsel for the target jurisdictions.

## Validation

```bash
npm run build
npm run check:domains
npm run check:responsive
```

Run `npm run check:responsive` with the Astro dev server available at
`RESPONSIVE_CHECK_BASE_URL` or `http://localhost:4321`.

Use `npm run check` for the complete website release validation.

## Contribution Governance

- External contributions must be submitted through Pull Requests.
- Follow `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, and this `SKILL.md`.
- MNSCloud may choose to pay, sponsor, contract, or hire contributors when work demonstrates strong
  value, but paid work requires explicit written agreement and is never implied by opening a Pull
  Request.
