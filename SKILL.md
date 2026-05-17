# MNSCloud Website Skill

Use this repository for the public MNSCloud website.

## Purpose

- Present MNSCloud modules, architecture, security posture, and developer ecosystem.
- Stay separate from the Angular administrative app.
- Be safe for public repositories and external contributors.

## Design Rules

- Use approved brand assets from `public/brand/`.
- If official assets are missing, use placeholders and document what must be replaced.
- The first viewport must communicate MNSCloud as the main brand.
- Keep pages direct and product-focused, not generic marketing filler.
- Avoid private customer data, internal topology, private domains, production IPs, or credentials.

## Engineering Rules

- Use Astro components and static pages by default.
- Keep JavaScript minimal unless a workflow needs interactivity.
- Future forms must submit only to public API endpoints with server-side validation.
- Keep documentation and public text in English unless a localized route is explicitly being added.

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
