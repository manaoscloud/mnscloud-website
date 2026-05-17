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

## Build

```bash
npm run build
```

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
