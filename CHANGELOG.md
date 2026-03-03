# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — 2026-03-03

### Added
- Cloudflare Pages deployment configuration (`wrangler.toml`) with observability enabled
- Version bump to `v1.0.0` in `package.json`
- Created `CHANGELOG.md` with full version history following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format

### Changed
- Rewrote `README.md` replacing the default Angular CLI template with project-specific documentation: features, project structure, prerequisites, installation, scripts, configuration (i18n, Cloudflare Pages, SSR), contributors, and link to changelog

### Fixed
- Pinned Yarn version to `1.22.22` to ensure stable Cloudflare Pages builds

---

## [1.0.0] — 2026-03-03
> Tag: `v1.0.0` — commit `9fd1eb6`

### Added
- Full Cloudflare Pages integration and iterative deployment setup
- SSR configuration with `@angular/ssr` and Express server (`server.ts`)

---

## [0.5.0] — 2025-11-21

### Changed
- Updated Bacsystem page content and added new sections/options

---

## [0.4.0] — 2025-06-02 to 2025-06-03

### Changed
- Reorganized and renamed source files for cleaner project structure
- Removed obsolete files and merged `develop` → `main` (PR #1)

---

## [0.3.0] — 2025-03-03

### Changed
- Refined global CSS styles and layout adjustments

---

## [0.2.0] — 2025-01-30 to 2025-02-20

### Added
- **About** section component and content (PRs #11, #12)
- **Home** page enhancements and menu improvements (PRs #8 – #13)

---

## [0.1.0] — 2025-01-28

### Added
- Initial project scaffold (`first commit`)
- CI/CD pipeline with GitHub Actions (`deploy.yaml`)
- **Header** component with initial styles
- **Home** / menu base component (PR #2)
- First deployment release
