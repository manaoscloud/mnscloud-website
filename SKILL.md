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
- Future forms must submit only to public API endpoints with server-side validation.
- Keep documentation and public text in English unless a localized route is explicitly being added.
- Blog and marketing content should be stored as Markdown/frontmatter, not in a database.
- The admin surface is git-based Decap CMS under `/admin`; do not introduce permanent secrets or
  private infrastructure data into CMS-managed content.
- Uploaded public website media belongs in `public/uploads/` and must be safe for public CDN
  distribution.
- New blog posts must define SEO-ready `title`, `description`, `date`, `author`, `tags`, and
  `status` frontmatter.

## Validation

```bash
npm run build
```

## Contribution Governance

- External contributions must be submitted through Pull Requests.
- Follow `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`, and this `SKILL.md`.
- MNSCloud may choose to pay, sponsor, contract, or hire contributors when work demonstrates strong
  value, but paid work requires explicit written agreement and is never implied by opening a Pull
  Request.
