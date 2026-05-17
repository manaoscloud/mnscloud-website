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

Recommended files:

- `logo.svg` or `logo.png`
- `watermark.png`
- `favicon.ico`
- `og-image.png`
- `brand-manual.pdf`

Until the official files are provided, the website uses `mnscloud-placeholder-mark.svg` as a safe
placeholder.

## Public Boundary

This website is public. Do not add secrets, customer data, production infrastructure details,
provider credentials, database credentials, private business rules, or API-side authorization logic.

Future API integrations, such as contact forms or demo requests, must use public API endpoints with
server-side validation.
