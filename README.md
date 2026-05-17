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

- `mnscloud-logo.svg`
- `mnscloud-logo-light.svg`
- `mnscloud-wordmark.svg`
- `mnscloud-wordmark-orange.svg`
- `mnscloud-watermark.svg`

When official vector exports or the brand manual are provided, update the assets in this folder and
preserve public-safe metadata only.

## Public Boundary

This website is public. Do not add secrets, customer data, production infrastructure details,
provider credentials, database credentials, private business rules, or API-side authorization logic.

Future API integrations, such as contact forms or demo requests, must use public API endpoints with
server-side validation.
