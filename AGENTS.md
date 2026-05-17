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
- Follow `brand_manual.pdf`.
- Use Safety Orange `#F5832E` and Hunter Green `#1D5B31`.
- Use Montserrat for body/subtitle text and Oswald for titles.
- Use `mnscloud-logo-light.png` on dark backgrounds, `mnscloud-logo.png` on light backgrounds, and
  `mnscloud-watermark.png` only as low-emphasis decorative media.
- Do not rotate, distort, recolor, add shadows, add textures, alter letter spacing, or change the
  CLOUD tag position.

## Contribution Workflow

- Contributions must use Pull Requests.
- Follow `CONTRIBUTING.md`, `SECURITY.md`, and `SKILL.md`.
- Paid work requires explicit written agreement and is never implied by opening a Pull Request.
