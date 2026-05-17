# AGENTS.md

This repository contains the standalone public MNSCloud website.

## Commands

- Install: `npm install`
- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Public Boundary

- This website is public and must not contain secrets, customer data, private domains/IPs, provider
  credentials, database credentials, master keys, or private business rules.
- API-side authorization, tenant scope, billing, routing ownership, policy, and secret resolution
  must stay in the MNSCloud API/control plane.

## Brand Assets

- Place approved assets in `public/brand/`.
- Do not commit unreleased partner/customer branding or private metadata.
- Use `mnscloud-logo-light.svg` on dark backgrounds, `mnscloud-logo.svg` on light backgrounds, and
  `mnscloud-watermark.svg` only as low-emphasis decorative media.

## Contribution Workflow

- Contributions must use Pull Requests.
- Follow `CONTRIBUTING.md`, `SECURITY.md`, and `SKILL.md`.
- Paid work requires explicit written agreement and is never implied by opening a Pull Request.
