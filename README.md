# Bacsystem Solutions — Corporate Website

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

Corporate website for **Bacsystem Solutions**, a company specialized in software development, technology consulting, and digital transformation. Built with Angular 18 with SSR support and deployed on Cloudflare Pages.

---

## Features

| Section | Description |
|---|---|
| **Home** | Hero section with company tagline and key value cards (Development, Innovation, Growth, Team) |
| **About** | Company mission, vision, and strategic positioning |
| **Services** | Technology solutions and consulting offerings |
| **Products** | Product catalog |
| **Team** | Team member profiles |
| **Clients** | Client showcase / logos |
| **Contact** | Contact form with address, email and phone info |

### Technical highlights

- **Angular 18** with standalone components and lazy-loaded routes
- **Server-Side Rendering (SSR)** via `@angular/ssr` + Express
- **Internationalization (i18n)** with `@ngx-translate` — supports English (`en`) and Spanish (`es`)
- **AOS** (Animate On Scroll) for scroll-driven animations
- **Bootstrap 5** + Bootstrap Icons for UI components and iconography
- **Swiper** for image/content carousels
- **GLightbox** for image lightbox gallery
- **PureCounter** for animated statistics counters
- Deployed to **Cloudflare Pages** with observability enabled

---

## Project Structure

```
src/
├── app/
│   ├── core/            # Shared services (LanguageService, MenuService) and models
│   ├── public/          # Public-facing pages (lazy-loaded)
│   │   ├── home/
│   │   ├── about/
│   │   ├── services/
│   │   ├── products/
│   │   ├── team/
│   │   ├── clients/
│   │   ├── contact/
│   │   ├── header/
│   │   └── footer/
│   └── shared/          # Shared components and utilities
├── styles.css
└── index.html
public/
├── assets/              # Fonts, images, vendor libraries
└── i18n/                # Translation files (en.json, es.json)
```

---

## Prerequisites

- **Node.js** >= 18
- **Yarn** 1.22.22 (pinned)
- **Angular CLI** 18

```bash
npm install -g yarn@1.22.22
npm install -g @angular/cli@18
```

---

## Installation

```bash
git clone https://github.com/bacsystem/bacsystem.git
cd bacsystem
yarn install
```

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn start` | Start dev server at `http://localhost:4200` (accessible on all interfaces) |
| `yarn build` | Build for development |
| `yarn build:prod` | Build for production |
| `yarn watch` | Build and watch in development mode |
| `yarn test` | Run unit tests with Karma + Jasmine |
| `yarn serve:ssr:bacsystem` | Serve the SSR production build locally |

---

## Configuration

### Environment / Build

The project uses Angular's built-in environment configuration. Production builds are triggered with:

```bash
yarn build:prod
# equivalent to: ng build --configuration production --base-href=/
```

Build output is placed in `dist/bacsystem/`.

### Internationalization

Translation files are located in `public/i18n/`. The default language is English.

| File | Language |
|---|---|
| `public/i18n/en.json` | English |
| `public/i18n/es.json` | Spanish |

To switch the default language, edit `src/app/core/language.service.ts`:

```typescript
this.translate.setDefaultLang('es'); // change to 'es' for Spanish
```

### Cloudflare Pages (`wrangler.toml`)

```toml
name = "bacsystem-solutions"
pages_build_output_dir = "./dist/browser"
compatibility_date = "2025-09-27"

[observability]
enabled = true
```

Deploy to Cloudflare Pages by pushing to the configured branch or running:

```bash
npx wrangler pages deploy dist/browser
```

### SSR (Server-Side Rendering)

SSR is configured via `@angular/ssr` with an Express server (`server.ts`). The server entry point is compiled to `dist/bacsystem/server/server.mjs`.

---

## Running Tests

```bash
yarn test
```

Unit tests use **Karma** with the **Chrome** launcher and **Jasmine**. Coverage reports are generated in `coverage/`.

---

## Contributors

| Name | GitHub / Email |
|---|---|
| Christian David Bacilio De La Cruz | [@dbacilio88](https://github.com/dbacilio88) — dbacilio88@outlook.es |

---

## License

This project is private. See [LICENSE](./LICENSE) for details.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.
