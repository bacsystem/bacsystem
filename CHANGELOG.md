# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.1] — 2026-03-27

### Changed
- Replaced all repeated HTML blocks with `@for` control-flow loops across `home`, `about`, `footer`, and `clients` components — eliminates duplicated markup and centralizes data in typed arrays on the component class.
- Migrated `clients.component.html` marquee track from hardcoded items to data-driven `@for` loops.
- Migrated dashboard sidebar nav, stat cards, chart bars, donut segments, task rows, and activity bar items to `@for` loops in `home.component.html`.
- Added `metrics` array to `about.component.ts`; metrics strip now rendered via `@for` with conditional separators using `$last`.
- Added `svcKeys` array to `footer.component.ts`; services list rendered via `@for` instead of 6 individual `<li>` elements.

### Removed
- Dead CSS classes `.wave-exit` and `.wave-exit svg` from `home.component.css` (never referenced in any template).
- Unused `showClients` boolean property and its `@if(showClients)` wrapper from `clients.component` (always `true`).
- `CommonModule` import from `contact.component.ts` (redundant in Angular 18 standalone with built-in control flow).
- `RouterModule` import from `home.component.ts` (no router directives in its template).
- `contact.name` field from the `Contact` interface and its assignment in `ngOnInit` (field never read in the template).

### Fixed
- `angular.json` test configuration referenced non-existent `public/styles.css`; corrected to `src/styles.css`.
- All 4 failing unit tests now pass (11/11 `SUCCESS`):
  - `FooterComponent` — added `TranslateModule.forRoot()` and `provideRouter([])`.
  - `TeamComponent` — added `TranslateModule.forRoot()`.
  - `ClientsComponent` — added `TranslateModule.forRoot()`, removed deprecated `RouterTestingModule`.
  - `PublicComponent` — migrated from deprecated `RouterTestingModule` to `provideRouter([])`, removed `detectChanges()` that triggered `NG0100`.

---

## [1.2.0] — 2026-03-03

### Added
- Configured real contact form integration using `nodemailer` via local Express SSR server.

### Changed
- Updated tab icon (favicon) to use the Bacsystem custom logo color replacing the default Angular one, using the hardcoded standard format.
- Set version to `v1.2.0`.

---

## [1.1.0] — 2026-03-03

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
