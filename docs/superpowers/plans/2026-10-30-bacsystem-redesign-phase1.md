# Bacsystem Redesign — Fase 1 (base + Inicio) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la landing oscura de una sola página por un sitio claro (dirección B) con URLs reales, sistema de tokens/componentes sin valores hardcodeados, prerender estático y la página Inicio terminada.

**Architecture:** Angular 18 standalone con builder `application` (esbuild). Un archivo de tokens CSS (primitivos → semánticos, temas = reasignación de semánticos) es la única fuente de valores; componentes compartidos en `src/app/shared/ui` los consumen. Un layout padre (header/footer) con rutas hijas lazy; SEO por ruta vía `route.data`; prerender en build, desplegado estático en Cloudflare Pages. Todo el trabajo va en la rama `feat/redesign`; el sitio no es desplegable hasta la última tarea.

**Tech Stack:** Angular 18.2, ngx-translate 16, Karma/Jasmine (ChromeHeadless), Stylelint, `node --test`, yarn 1.22, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-10-30-bacsystem-redesign-design.md`

## Global Constraints

- Angular 18, componentes standalone, yarn, despliegue Cloudflare Pages vía GitHub Actions desde `dist/browser`.
- Colores de marca: navy `#1B3080`, teal `#41B7A8` (teal solo como acento; para texto sobre fondo claro usar un token más oscuro que cumpla contraste AA 4.5:1).
- Dirección visual B: fondo claro por defecto, esquinas redondeadas, sombras suaves, mucho espacio. Modo oscuro opcional que sigue funcionando (reasignando tokens semánticos), sin rediseño a fondo.
- Prohibido en CSS de componentes y temas: colores literales (`#`, `rgb`, `hsl`, nombres), `px` en fuente/espaciado/radios fuera de tokens, `!important`, estilos en línea con valores de diseño. Solo `var(--...)`.
- Un solo set de iconos (Bootstrap Icons) vía componente `ui-icon`; sin emojis ni SVG sueltos.
- No usar `public/assets/img/home.png`, `hero-img.png`, `main/hero-img.png` (stock isométrico).
- Idioma por defecto español; selector ES/EN actual; elección guardada en el navegador; sin URLs por idioma.
- URLs: `/`, `/servicios`, `/productos`, `/productos/operaai`, `/productos/sophia`, `/nosotros`, `/contacto`. Sin prefijo `/public`.
- Canonical y dominio: `https://bacsystemsolutions.com`.
- Páginas no construidas (`/servicios`, `/productos*`, `/nosotros`): `noindex` y fuera del sitemap. `/` y `/contacto` indexables.
- Cifras, fotos de equipo y casos son de ejemplo y llevan comentario `EJEMPLO` en el archivo de datos; ninguna cifra contradice otra ni el SEO.
- Móvil desde 360 px; Chrome/Safari/Firefox/Edge actuales; respetar `prefers-reduced-motion`.
- Anti-metas: sin degradados llamativos, brillos, tarjetas de vidrio, filas de tarjetas idénticas con icono en cuadrado de color, frases genéricas ("transformamos ideas", "soluciones innovadoras").
- Tests existentes (`*.spec.ts`) siguen pasando o se actualizan. Estilo de commits: Conventional Commits.

## Review Focus

1. Idioma guardado inválido o `localStorage` inaccesible (`'fr'`, `null`, excepción) → cae a `es` sin romper el arranque. (Task 4)
2. Contenido ocultado por la animación de aparición cuando no hay JS o en prerender → debe verse visible por defecto. (Task 7)
3. Listas de datos vacías (todos los logos de clientes retirados, producto destacado retirado) → la sección desaparece sin dejar huecos ni errores. (Task 8)
4. `prefers-reduced-motion` activo → los contadores muestran el valor final al instante y no hay animaciones de entrada. (Task 7)
5. Cambiar de idioma estando en una página → título, descripción y `<html lang>` se actualizan sin recargar. (Task 5)

---

## File Structure

```
src/styles/fonts.css            @font-face / @fontsource imports
src/styles/tokens.css           primitivos + semánticos + [data-theme=dark]
src/styles/base.css             reset, tipografía, .container, foco, reduced-motion
src/app/shared/ui/              icon, button, card, tag, section-heading, section, field (+ index.ts)
src/app/shared/directives/      reveal.directive.ts, count-up.directive.ts
src/app/core/                   language.service.ts, theme.service.ts, seo.service.ts (modificados)
src/app/data/site.data.ts       SITE, SERVICES, PRODUCTS, CLIENTS, STATS
src/app/layout/                 site-layout, site-header, site-footer
src/app/pages/                  home, contact, coming-soon, ui-guide
src/app/app.routes.ts
scripts/check-ui.mjs, scripts/check-ui.test.mjs
stylelint.config.cjs
public/_redirects, public/sitemap.xml, public/robots.txt
```

Se eliminan en Task 11: `src/app/public/**`, `core/menu.service.ts`, `core/scroll-nav.service.ts`, `server.ts`, `src/main.server.ts` (se reemplaza por uno mínimo, ver Task 10), vendors no usados, `public/assets/js/main.js`, `docs/notes.txt`, `docs/tmp.txt`, `clients/client-6 copy.png`.

---

### Task 1: Rama, test infra y lint de UI

**Files:**
- Modify: `karma.config.js`, `package.json`
- Create: `stylelint.config.cjs`, `scripts/check-ui.mjs`, `scripts/check-ui.test.mjs`

**Interfaces:**
- Produces: scripts yarn `test:ci` (`ng test --watch=false --browsers=ChromeHeadless`), `lint:css`, `lint:ui` (= `lint:css` + `node scripts/check-ui.mjs`), `test:ui` (= `node --test scripts/`). `check-ui.mjs` exporta `checkTokenParity(css: string): string[]`, `checkTemplates(files: {path:string, content:string}[]): string[]`, `checkIconUsage(files): string[]`; cada una devuelve lista de errores (vacía = OK). Ejecutado como CLI, sale con código 1 si hay errores.

- [ ] **Step 1: Crear la rama y arreglar la infraestructura**: `git switch -c feat/redesign`; `yarn install`; en `karma.config.js` quitar `karma-firefox-launcher` (no está en `package.json`, el `require` rompe `ng test`) y dejar `browsers: ['ChromeHeadless']`, `singleRun: true`, `restartOnFileChange: false`.
- [ ] **Step 2: Verificar la línea base**: añadir script `test:ci`; correr `yarn test:ci`. Expected: los specs existentes ejecutan (pueden fallar por traducciones; anotar cuáles, no arreglarlos aquí).
- [ ] **Step 3: Escribir test fallido** `scripts/check-ui.test.mjs` con `node:test`:
  - `checkTokenParity` devuelve error nombrando `--color-text` si existe en `:root` pero no en `[data-theme='dark']`; devuelve `[]` si ambos bloques tienen los mismos `--color-*`.
  - `checkTemplates` marca `<div style="color:#fff">` y `style="margin: 12px"`, pero acepta `style="--i: 2"` y `[style.--i]="idx"`.
  - `checkIconUsage` marca una clase `bi bi-` en cualquier archivo cuyo path no termine en `shared/ui/icon/icon.component.html`.
- [ ] **Step 4: Run** `yarn test:ui` → FAIL (módulo no existe).
- [ ] **Step 5: Implementar `scripts/check-ui.mjs`** con las tres funciones y el CLI (lee `src/styles/tokens.css` y `src/app/**/*.html`). Expected al correr `yarn test:ui`: PASS.
- [ ] **Step 6: Instalar `stylelint` y crear `stylelint.config.cjs`** con reglas: `color-no-hex`, `color-named: 'never'`, `function-disallowed-list: ['rgb','rgba','hsl','hsla','hwb']`, `declaration-no-important`, `declaration-property-value-disallowed-list` que prohíbe valores `/\d+(\.\d+)?px/` en `font-size`, `margin*`, `padding*`, `gap`, `row-gap`, `column-gap`, `border-radius`; `overrides` que exime `src/styles/tokens.css`. Los `@media` pueden usar `48em` y `64em` (únicos breakpoints). Scripts `lint:css` (`stylelint "src/**/*.css"`) y `lint:ui`.
- [ ] **Step 7: Verificar que el lint falla**: crear `src/tmp-bad.css` con `a { color: #fff; font-size: 12px; }`, correr `yarn lint:css` → Expected: exit 1 con 2 errores; borrar el archivo; `yarn lint:css` sobre el CSS heredado fallará (esperado, desaparece en Task 11): documentar en el commit que el lint se exige verde desde Task 11.
- [ ] **Step 8: Commit** `chore: add headless test config and ui lint tooling`

---

### Task 2: Tokens, base CSS, fuentes y ThemeService

**Files:**
- Create: `src/styles/fonts.css`, `src/styles/tokens.css`, `src/styles/base.css`, `src/app/core/theme.service.spec.ts`
- Modify: `angular.json` (build y test: `styles` pasa a `["src/styles/fonts.css","src/styles/tokens.css","src/styles/base.css","public/assets/vendor/bootstrap-icons/bootstrap-icons.min.css"]`; `scripts` pasa a `[]`), `src/app/core/theme.service.ts`, `src/index.html` (quitar `<a id="scroll-top">`, `<div id="preloader">`, `lang="es"`)

**Interfaces:**
- Produces (nombres exactos de tokens semánticos que consumen todos los componentes):
  - Color: `--color-bg`, `--color-bg-alt`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-heading`, `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-accent`, `--color-accent-text` (teal oscuro con contraste ≥ 4.5:1 sobre `--color-bg`), `--color-accent-soft`, `--color-border`, `--color-focus`
  - Escala: `--space-1`…`--space-9` (rem), `--radius-sm|md|lg|pill`, `--shadow-sm|md|lg`, `--border-width`, `--text-xs|sm|md|lg|xl|2xl|3xl|4xl` (los grandes con `clamp`), `--weight-regular|medium|bold`, `--leading-tight|normal`, `--duration-fast|base|slow`, `--ease-out`, `--z-header|overlay`, `--container-max`, `--header-height`, `--font-display`, `--font-body`
  - Tema oscuro: bloque `[data-theme='dark']` que redefine **todos** los `--color-*`.
- `ThemeService`: `init(): void` (modo guardado en `localStorage['theme-mode']` o `'light'` por defecto), `cycle(): void`, `currentMode: ThemeMode`, `isDark: boolean`, `icon: IconName` (de Task 3; hasta entonces `string` sin el prefijo `bi-`: `'sun-fill'|'moon-fill'|'circle-half'`). Ya no añade la clase `dark-mode` al body.

- [ ] **Step 1: Test fallido `theme.service.spec.ts`**: (a) sin valor guardado, `init()` deja `document.documentElement.dataset['theme'] === 'light'` y `currentMode === 'light'`; (b) con `localStorage['theme-mode']='dark'`, queda `'dark'` y `isDark === true`; (c) `cycle()` recorre `light → dark → system → light`; (d) tras `init()` el body no tiene la clase `dark-mode`. Limpiar `localStorage` en `afterEach`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL en (a) y (d).
- [ ] **Step 3: Modificar `ThemeService`** (default `'light'`, quitar `dark-mode`, `icon` sin prefijo).
- [ ] **Step 4: Escribir `tokens.css`**: primitivos (`--navy-*`, `--teal-*`, `--gray-*`) con navy `#1B3080` y teal `#41B7A8` como valores base; semánticos claros en `:root`; oscuros en `[data-theme='dark']`. Escala tipográfica y de espaciado en `rem`. Comentario de cabecera: "los únicos valores literales del proyecto viven aquí".
- [ ] **Step 5: Fuentes**: verificar licencia y formato de `Caviar Dreams` y `Elemental End` (están en `public/assets/font/`); si no son aptas para web, instalar `@fontsource/michroma` (display, solo títulos cortos y etiquetas por su parecido con el logo) y `@fontsource-variable/dm-sans` (cuerpo y títulos largos) e importarlos en `fonts.css`. Definir `--font-display` y `--font-body`. Anotar la elección y su licencia en un comentario de `fonts.css`.
- [ ] **Step 6: `base.css`**: reset mínimo, `body` con `--font-body`, `--color-bg`, `--color-text`; `h1..h4` con `--font-display`/`--color-heading`; clase `.container` (`max-width: var(--container-max)`, padding lateral con `--space-*`); `:focus-visible` con `--color-focus`; `@media (prefers-reduced-motion: reduce)` que anula animaciones y transiciones.
- [ ] **Step 7: Verificar**: `yarn test:ci` (ThemeService PASS), `yarn lint:css` sobre `src/styles/` (verde, tokens exento), y un test de paridad ejecutado con `node -e` o `yarn lint:ui` sobre `tokens.css` sin errores de paridad claro/oscuro. Expected: todo PASS.
- [ ] **Step 8: Commit** `feat: add design tokens, base styles and light-default theme`

---

### Task 3: Componentes UI compartidos

**Files:**
- Create: `src/app/shared/ui/icon/icon.component.{ts,html,css,spec.ts}`, `button/button.component.{ts,css,spec.ts}`, `card/card.component.{ts,css,spec.ts}`, `tag/tag.component.{ts,css,spec.ts}`, `section-heading/…`, `section/…`, `field/…`, `src/app/shared/ui/index.ts` (re-exporta todo)

**Interfaces:**
- `export type IconName = 'arrow-right'|'arrow-up-right'|'list'|'x-lg'|'globe2'|'sun-fill'|'moon-fill'|'circle-half'|'envelope'|'telephone'|'geo-alt'|'check2-circle'|'code-slash'|'gear'|'graph-up-arrow'|'cloud'|'box'|'chevron-right'`
- `<ui-icon name label? size?>`: `name = input.required<IconName>()`, `label = input<string>()`, `size = input<'sm'|'md'|'lg'>('md')`. Renderiza `<i class="bi bi-{name}">`; `aria-hidden="true"` salvo que haya `label` (entonces `role="img"` y `aria-label`).
- `a[ui-button], button[ui-button]` (selector de atributo): `variant = input<'primary'|'secondary'|'text'>('primary')`, `size = input<'md'|'lg'>('md')`; host classes `ui-btn ui-btn--{variant} ui-btn--{size}`.
- `<ui-card>`: `variant = input<'plain'|'outlined'|'tinted'>('outlined')`, `interactive = input(false)` (añade elevación en hover).
- `<ui-tag>`: `tone = input<'neutral'|'accent'|'primary'>('neutral')`.
- `<ui-section-heading>`: `eyebrow = input<string>()`, `title = input.required<string>()`, `subtitle = input<string>()`, `align = input<'start'|'center'>('start')` (textos ya traducidos por el llamador; el título es un `<h2>`).
- `<ui-section>`: `tone = input<'default'|'alt'|'primary'>('default')`, `sectionId = input<string>()`; proyecta contenido dentro de `.container`.
- `<ui-field>`: `label = input.required<string>()`, `hint = input<string>()`, `error = input<string>()`; proyecta un `input|textarea`; `ViewEncapsulation.None` para estilizar el control proyectado.

- [ ] **Step 1: Tests fallidos** (un spec por componente): `IconComponent` con `name='envelope'` renderiza `i.bi.bi-envelope` con `aria-hidden="true"`, y con `label='Correo'` renderiza `aria-label="Correo"` sin `aria-hidden`; el host de `<a ui-button variant="secondary" size="lg">` tiene las clases `ui-btn ui-btn--secondary ui-btn--lg`; `<ui-card [interactive]="true">` añade `ui-card--interactive`; `<ui-section-heading title="X" align="center">` renderiza `h2` con `X` y clase `is-center`; no renderiza el eyebrow si no se pasa; `<ui-field label="Email" error="Inválido">` asocia `label` con el control proyectado (`for`/`id` generado) y muestra el error con `role="alert"`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL (componentes no existen).
- [ ] **Step 3: Implementar los siete componentes** con CSS que usa **solo** `var(--...)` de Task 2 (botón primario: `--color-primary`/`--color-on-primary`, radio `--radius-pill`; secundario: borde `--color-border`; texto: `--color-primary` subrayado al hover). Sin tipografía ni espaciado literal.
- [ ] **Step 4: Run** `yarn test:ci` y `yarn lint:css` → PASS en los specs nuevos; lint verde para `src/app/shared/**`.
- [ ] **Step 5: Actualizar `ThemeService.icon`** para devolver `IconName` (cambio de tipo, sin cambio de valores).
- [ ] **Step 6: Commit** `feat: add shared ui components`

---

### Task 4: Idioma (español por defecto, persistente) y arranque sin parpadeo

**Files:**
- Modify: `src/app/core/language.service.ts`, `src/app/app.config.ts`
- Create: `src/app/core/language.service.spec.ts`

**Interfaces:**
- Produces: `LanguageService` con `readonly supported = ['es','en'] as const`, `init(): Promise<void>` (idioma = valor válido de `localStorage['lang']` o `'es'`; usa `translate.use(lang)` y espera a que carguen las traducciones), `useLanguage(lang: string): void` (ignora no soportados; guarda en `localStorage['lang']`; fija `document.documentElement.lang`), `getCurrentLang(): 'es'|'en'`. `app.config.ts` registra `APP_INITIALIZER` que llama `languageService.init()` para que no se vea el texto con claves antes de cargar. Todo acceso a `localStorage` en `try/catch` y solo en navegador (`isPlatformBrowser`).

- [ ] **Step 1: Tests fallidos** con `TranslateModule.forRoot()` y `TranslateService.setTranslation` para `es` y `en`: sin valor guardado, `init()` resuelve con `getCurrentLang() === 'es'` y `<html lang="es">`; con `lang='en'` guardado, queda `'en'`; con `lang='fr'` guardado, cae a `'es'`; si `localStorage.getItem` lanza, cae a `'es'` sin propagar el error; `useLanguage('en')` guarda `'en'` y cambia `<html lang>`; `useLanguage('xx')` no cambia nada.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar** `LanguageService` y registrar el initializer; en `app.config.ts` añadir `provideHttpClient(withFetch())` y `provideClientHydration()`; `TranslateHttpLoader` sigue con `./i18n/`.
- [ ] **Step 4: Run** `yarn test:ci` → PASS.
- [ ] **Step 5: Commit** `feat: default to spanish with persisted language`

---

### Task 5: Rutas, SEO por ruta y páginas placeholder

**Files:**
- Modify: `src/app/core/seo.service.ts`, `src/app/app.routes.ts`, `src/app/app.config.ts`, `src/app/app.component.ts`, `public/i18n/es.json`, `public/i18n/en.json`
- Create: `src/app/core/seo.service.spec.ts`, `src/app/app.routes.spec.ts`, `src/app/pages/coming-soon/coming-soon.page.ts`, `src/app/pages/home/home.page.ts` (stub `<h1>`; se completa en Task 8), `src/app/pages/contact/contact.page.ts` (stub; se completa en Task 9), `src/app/layout/site-layout.component.ts` (stub con `<router-outlet/>`; se completa en Task 6)

**Interfaces:**
- `export interface SeoRouteData { titleKey: string; descriptionKey: string; indexable?: boolean }` (default `true`). Cada ruta declara `data: { seo: SeoRouteData }`.
- `SeoService.apply(seo: SeoRouteData, path: string): void`: título y `og:title` traducidos; `description`, `og:description`, `twitter:*`; `robots` = `'index, follow'` o `'noindex, nofollow'`; canonical y `og:url` = `https://bacsystemsolutions.com` + `path` (sin barra final salvo `/`); `og:locale` `es_PE`/`en_US`; `<html lang>`. `SeoService.init(): void` se suscribe a `NavigationEnd` (lee `data.seo` de la ruta más profunda) y a `translate.onLangChange` y vuelve a aplicar. `AppComponent.ngOnInit` llama `init()` y ya no llama a AOS.
- Tabla de rutas (todas hijas de `SiteLayoutComponent`, `loadComponent`): `''`→`HomePageComponent`; `contacto`→`ContactPageComponent`; `servicios`, `productos`, `productos/operaai`, `productos/sophia`, `nosotros`→`ComingSoonPageComponent` con `indexable: false`; `**`→`redirectTo: ''`. `provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }))`. En desarrollo (`isDevMode()`) se agrega `guia-ui` (Task 6) con `indexable: false`.
- Claves i18n nuevas bajo `application.site.seo.{home,contact,services,products,operaai,sophia,about}.{title,description}` en es y en.

- [ ] **Step 1: Tests fallidos** `seo.service.spec.ts` (con `TranslateService.setTranslation`): `apply({titleKey:'t',descriptionKey:'d'}, '/contacto')` fija `document.title`, `link[rel=canonical]` = `https://bacsystemsolutions.com/contacto` y `meta[name=robots]` = `index, follow`; con `indexable:false` → `noindex, nofollow`; `apply(..., '/')` produce canonical `https://bacsystemsolutions.com/`; tras `translate.use('en')` con `init()` activo, título y `<html lang>` cambian a inglés. `app.routes.spec.ts`: cada ruta de la tabla existe y su `data.seo.indexable` es el esperado; `'**'` redirige a `''`; ninguna ruta empieza con `public`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar** `SeoService`, rutas y stubs. Escribir las claves `site.seo.*` (textos concretos en español peruano; inglés equivalente). Eliminar del `SeoService` el código que fija `og:image` a un archivo inexistente: usar `/assets/img/bacsystem/Logo_BACSYSTEM-[Color-Horizontal].png` como imagen OG provisional (comentario `EJEMPLO: reemplazar por og-cover.png real`).
- [ ] **Step 4: Run** `yarn test:ci` → PASS. Luego `yarn start` y comprobar manualmente que `/`, `/contacto` y `/servicios` cargan y que `/public/home` redirige a `/`.
- [ ] **Step 5: Commit** `feat: clean routes with per-route seo`

---

### Task 6: Layout (header, footer) y guía de UI

**Files:**
- Create: `src/app/layout/site-header/site-header.component.{ts,html,css,spec.ts}`, `src/app/layout/site-footer/site-footer.component.{ts,html,css,spec.ts}`, `src/app/pages/ui-guide/ui-guide.page.{ts,html,css}`
- Modify: `src/app/layout/site-layout.component.ts` (usa header, `<main id="contenido">`, footer), `src/app/app.routes.ts` (ruta `guia-ui` solo dev), `public/i18n/{es,en}.json`

**Interfaces:**
- Consumes: componentes de Task 3, `LanguageService` (Task 4), `ThemeService` (Task 2), `SITE` de Task 7 (para footer; hasta entonces, constantes provisionales en el mismo archivo marcadas `// mover a site.data.ts en Task 7`).
- Produces: `NAV_LINKS: { path: string; labelKey: string }[]` en `src/app/layout/nav-links.ts` con `/servicios`, `/productos`, `/nosotros`, `/contacto`.
- Header: logo `Logo_BACSYSTEM-[Color-Horizontal].png` (y `Blanco-Horizontal` en modo oscuro), enlaces con `routerLink` + `routerLinkActive="is-active"`, botón de idioma que alterna ES/EN (`aria-label` traducido), botón de tema, botón `a[ui-button]` "Cotizar proyecto" a `/contacto`, menú móvil (<64em) con `aria-expanded`; se cierra al navegar y con `Escape`; sin `IntersectionObserver` ni `scrollIntoView`.

- [ ] **Step 1: Tests fallidos** `site-header.component.spec.ts`: renderiza un enlace por cada `NAV_LINKS` con el `href` correcto; el botón de menú alterna `aria-expanded` entre `false` y `true`; tecla `Escape` en el menú abierto lo cierra; navegar (`router.navigateByUrl`) con el menú abierto lo cierra; clic en el botón de idioma llama `LanguageService.useLanguage('en')` cuando el actual es `'es'`. `site-footer.component.spec.ts`: muestra email y teléfono de contacto y un enlace por `NAV_LINKS`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar header, footer y layout** con CSS solo de tokens; header fijo con `--z-header` y altura `--header-height`; footer sobrio (columnas de navegación, contacto, copyright), sin franja CTA propia (la banda de contacto es parte de Inicio). Textos por i18n bajo `application.site.nav.*` y `application.site.footer.*`.
- [ ] **Step 4: `guia-ui` page**: muestra paleta de tokens semánticos, escala tipográfica, todos los `IconName`, variantes de `ui-button`, `ui-card`, `ui-tag`, `ui-field`, y un conmutador de tema; añadirla a las rutas solo si `isDevMode()`.
- [ ] **Step 5: Run** `yarn test:ci`, `yarn lint:ui` (el CSS de `src/app/layout`, `src/app/pages` y `src/app/shared` debe estar verde) → PASS. Verificar visualmente en `yarn start` a 360 px y 1280 px, tema claro y oscuro.
- [ ] **Step 6: Commit** `feat: add site layout, header, footer and ui guide`

---

### Task 7: Datos del sitio y directivas de movimiento

**Files:**
- Create: `src/app/data/site.data.ts`, `src/app/data/site.data.spec.ts`, `src/app/shared/directives/reveal.directive.ts`, `reveal.directive.spec.ts`, `count-up.directive.ts`, `count-up.directive.spec.ts`
- Modify: `src/app/layout/site-footer/*` (usa `SITE`)

**Interfaces:**
- `site.data.ts`:
  ```ts
  export const SITE = { url: 'https://bacsystemsolutions.com', name: 'Bacsystem Solutions',
    email: 'bacsystem.sac@gmail.com', phone: '+51 907 892 868', address: 'Av. B 200 Lima' } as const;
  export interface ServiceItem { id: 'web'|'consulting'|'optimization'|'cloud'; icon: IconName; titleKey: string; descriptionKey: string }
  export interface ProductItem { id: 'operaai'|'sophia'; route: string; logo: string; nameKey: string; taglineKey: string; featured?: boolean }
  export interface ClientLogo { id: string; name: string; logo: string }
  export interface StatItem { id: string; value: number; suffix: string; labelKey: string; example: true }
  export const SERVICES: ServiceItem[]; export const PRODUCTS: ProductItem[];
  export const CLIENTS: ClientLogo[]; export const STATS: StatItem[];
  ```
  `CLIENTS` contiene solo `client-7.png` y `client-8.png` (los dos que hoy muestra el sitio); los demás logos se agregan cuando el dueño confirme. `PRODUCTS` usa `operaai-favicon.svg` y `sophia-favicon.svg`; OperaAI es `featured`. `STATS` lleva comentario `// EJEMPLO: cifras de muestra, reemplazar por reales` y `example: true`.
- `[appReveal]` (directiva): en navegador agrega `is-reveal-pending` (`opacity:0; transform` vía tokens) solo después de que `IntersectionObserver` está disponible y el elemento está fuera de pantalla, y `is-revealed` al entrar; **nunca** oculta en servidor, sin `IntersectionObserver`, o con `prefers-reduced-motion`.
- `[appCountUp]` (directiva): `appCountUp = input.required<number>()`, `duration = input(1200)`; escribe el número en `textContent`; anima al entrar en pantalla; con reduced-motion o sin `IntersectionObserver` o en servidor escribe el valor final de inmediato.

- [ ] **Step 1: Tests fallidos** `site.data.spec.ts`: ids únicos en cada lista; todas las rutas de `PRODUCTS` empiezan con `/productos/`; `STATS.every(s => s.example === true)`; ningún `labelKey` ni valor contiene el texto `150` ni `320`. `reveal.directive.spec.ts`: en plataforma servidor el elemento no recibe `is-reveal-pending`; con `matchMedia('(prefers-reduced-motion: reduce)')` verdadero no recibe `is-reveal-pending`; sin `IntersectionObserver` (borrarlo del `window` en el test) queda visible. `count-up.directive.spec.ts`: con reduced-motion el `textContent` es el valor final inmediatamente; en servidor igual.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar datos y directivas** (inyectar `PLATFORM_ID`, `isPlatformBrowser`; desconectar el observer al destruir).
- [ ] **Step 4: Run** `yarn test:ci` → PASS.
- [ ] **Step 5: Commit** `feat: add site data and motion directives`

---

### Task 8: Página Inicio

**Files:**
- Modify: `src/app/pages/home/home.page.ts` (sustituye el stub), `public/i18n/{es,en}.json` (reemplazar `application.home.*` por las claves nuevas y borrar las del dash/hero anterior)
- Create: `src/app/pages/home/home.page.{html,css,spec.ts}`, `src/app/pages/home/product-preview/product-preview.component.{ts,html,css}`

**Interfaces:**
- Consumes: `ui-*` (Task 3), `SERVICES`, `PRODUCTS`, `CLIENTS`, `STATS`, `SITE` (Task 7), `appReveal`, `appCountUp`.
- `HomePageComponent` (selector `app-home-page`) con una `<ui-section>` por bloque, en este orden: **hero**, **clientes** (solo si `CLIENTS.length > 0`), **servicios**, **producto destacado** (solo si existe un `PRODUCTS` con `featured`), **cifras**, **banda de contacto**. `ProductPreviewComponent` es un marcador de posición visual de interfaz de producto hecho con HTML/CSS y tokens (sin imágenes) con comentario `EJEMPLO: reemplazar por captura real`.
- Copy es (propuesta, claves en `application.home.*`): `hero.title` "Software que tu equipo sí usa.", `hero.subtitle` "Desarrollamos sistemas web, móviles y de IA a medida para empresas que quieren crecer sin complicarse.", `hero.cta` "Cotizar proyecto", `hero.secondary` "Ver productos", `hero.eyebrow` "Software a medida · Lima, Perú", `clients.label` "Confían en nosotros", `services.title` "Qué hacemos", `featured.cta` "Conocer más", `contact.title` "¿Tienes un proyecto en mente?", `contact.cta` "Hablemos". Descripciones de servicios tomadas de `application.services.cards` actuales. Inglés equivalente. Sin frases de la lista de anti-metas.
- Servicios con composición **no repetitiva**: un servicio principal (`web`) grande a la izquierda y los otros tres como lista numerada a la derecha, no cuatro tarjetas iguales.

- [ ] **Step 1: Tests fallidos** `home.page.spec.ts` (con traducciones `es` cargadas vía `setTranslation`): renderiza un solo `h1` con el texto de `hero.title`; el CTA del hero tiene `href` `/contacto` y el secundario `/productos`; la sección de clientes tiene un `img` por cada `CLIENTS`; **con `CLIENTS` vacío** (sobrescribiendo el valor con un provider/inyección de datos o `spyOnProperty`) no existe la sección de clientes; **sin producto `featured`** no existe la sección de producto; los contadores se renderizan con el valor final en servidor/reduced-motion; el texto renderizado de toda la página no contiene `150+` ni `320+`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar la página** y su CSS solo con tokens; hero con `h1` en `--font-display`, preview a la derecha; aplicar `appReveal` en bloques (no en el hero); franja de logos con desplazamiento CSS lento y `animation: none` en reduced-motion; la banda de contacto usa `--color-primary` de fondo. Los datos de la página vienen de `site.data.ts`, no de literales en el componente.
- [ ] **Step 4: Run** `yarn test:ci`, `yarn lint:ui` → PASS.
- [ ] **Step 5: Verificación visual** con `yarn start`: 360 px, 768 px y 1280 px, tema claro y oscuro, JS activo. Comparar contra la maqueta aprobada (dirección B). Registrar capturas fuera del repo.
- [ ] **Step 6: Commit** `feat: build new home page`

---

### Task 9: Página Contacto (mínima)

**Files:**
- Modify: `src/app/pages/contact/contact.page.ts` (sustituye el stub), `public/i18n/{es,en}.json`
- Create: `src/app/pages/contact/contact.page.{html,css,spec.ts}`

**Interfaces:**
- Consumes: `SITE`, `ui-section-heading`, `ui-card`, `ui-icon`, `a[ui-button]`.
- `ContactPageComponent`: encabezado, tres tarjetas con enlaces `mailto:` (email), `tel:` (teléfono) y la dirección; sin formulario (fase 2). No se agrega WhatsApp hasta que el dueño confirme que el número lo usa.

- [ ] **Step 1: Test fallido** `contact.page.spec.ts`: el enlace de email tiene `href="mailto:bacsystem.sac@gmail.com"`; el de teléfono `href="tel:+51907892868"` (sin espacios); se muestra la dirección; hay un `h1`.
- [ ] **Step 2: Run** `yarn test:ci` → FAIL.
- [ ] **Step 3: Implementar**; la página no incluye `ReactiveFormsModule`.
- [ ] **Step 4: Run** `yarn test:ci`, `yarn lint:ui` → PASS.
- [ ] **Step 5: Commit** `feat: add minimal contact page`

---

### Task 10: Prerender, redirecciones, SEO estático y CI de lint

**Files:**
- Modify: `angular.json`, `tsconfig.app.json`, `package.json`, `src/main.server.ts`, `src/app/app.config.server.ts`, `src/index.html`, `public/sitemap.xml`, `public/robots.txt`, `.github/workflows/deploy.yaml`
- Create: `public/_redirects`
- Delete: `server.ts`

**Interfaces:**
- `angular.json` `build.options`: `"server": "src/main.server.ts"`, `"prerender": true`, `"ssr": false`; `outputPath` sigue `dist` (salida estática en `dist/browser`). Quitar los `scripts` y estilos de vendors.
- `public/_redirects`: `/public/home /  301`, `/public/about / 301`, `/public/services /servicios 301`, `/public/products /productos 301`, `/public/team /nosotros 301`, `/public/contact /contacto 301`, `/public /  301`, `/public/ / 301`.
- `sitemap.xml`: solo `https://bacsystemsolutions.com/` y `/contacto`, sin `xhtml:link` de hreflang.
- `index.html`: metas por defecto en español, JSON-LD `Organization` con `telephone` y `email` reales en `contactPoint`, sin `<div id="preloader">`, sin enlace `scroll-top`.
- CI: agregar paso `yarn lint:ui` y `yarn test:ui` antes de `yarn build:prod`.

- [ ] **Step 1: Configurar prerender** (cambios de `angular.json`, `tsconfig.app.json` sin `server.ts`, borrar `server.ts`, quitar scripts `serve:ssr:*`). `main.server.ts` queda exportando `bootstrap` con `config` de `app.config.server.ts`.
- [ ] **Step 2: Verificar el build**: `yarn build:prod`. Expected: build sin errores y archivos `dist/browser/index.html`, `dist/browser/contacto/index.html`, `dist/browser/servicios/index.html`.
- [ ] **Step 3: Verificar el contenido prerenderizado**: `grep -c "Software que tu equipo" dist/browser/index.html` → `1` o más (texto en español dentro del HTML), `grep -c 'noindex' dist/browser/servicios/index.html` → `1` o más, `grep -c 'noindex' dist/browser/index.html` → `0`. Si el HTML sale con claves (`application.home...`) en vez de texto porque el prerender no logra leer `./i18n/*.json`, sustituir `TranslateHttpLoader` en `app.config.server.ts` por un `TranslateLoader` que lee `public/i18n/{lang}.json` con `fs` y repetir este paso.
- [ ] **Step 4: Verificar servido estático**: `npx http-server dist/browser -p 8080` y abrir `/contacto` con recarga directa; sin parpadeo de claves de traducción; cambiar idioma y recargar mantiene la elección.
- [ ] **Step 5: Actualizar `sitemap.xml`, `robots.txt`, `index.html`, `_redirects` y el workflow de CI.** El despliegue (`pages deploy dist/browser`) no cambia.
- [ ] **Step 6: Commit** `feat: prerender static pages with redirects and seo files`

---

### Task 11: Limpieza del código heredado

**Files:**
- Delete (tras verificar con `grep -r` que ya no se referencian): `src/app/public/**`, `src/app/core/menu.service.ts`, `src/app/core/scroll-nav.service.ts`, `src/app/core/models/`, `src/styles.css`, `public/assets/js/main.js`, `public/assets/vendor/{bootstrap,aos,g-lightbox,swiper,purecounter,google-fonts}` y los archivos de `bootstrap-icons` que no sean el `.min.css` y su fuente, `public/assets/img/clients/client-6 copy.png`, `docs/notes.txt`, `docs/tmp.txt`
- Modify: `package.json` (quitar `aos`, `@types/aos`, `express`, `@types/express`; mantener `@angular/ssr` porque lo requiere el prerender), `public/i18n/{es,en}.json` (quitar claves de las secciones que ya no existen), `README.md` (pasos de desarrollo y convención de UI)

- [ ] **Step 1: Para cada ruta a borrar**, correr `grep -rn "<nombre>" src public angular.json` y borrar solo si no hay referencias fuera de lo que se borra. Conservar en `public/i18n` las claves de `products`, `services`, `about` y `team` que usarán las fases siguientes (anotarlas en el commit).
- [ ] **Step 2: Verificación completa**: `yarn lint:ui` y `yarn test:ui` verdes; `yarn lint:css` sobre **todo** `src/**/*.css` verde (sin colores ni px literales fuera de `tokens.css`); `yarn test:ci` verde; `yarn build:prod` sin errores ni budgets excedidos; `grep -rn "dark-mode\|bi bi-" src | grep -v icon.component` sin resultados.
- [ ] **Step 3: Actualizar `README.md`** con: comandos (`start`, `build:prod`, `test:ci`, `lint:ui`), estructura de carpetas, y la convención de UI (tokens, componentes, iconos, qué rechaza el lint).
- [ ] **Step 4: Commit** `chore: remove legacy template code and unused dependencies`

---

## Self-Review

- **Spec coverage:** dirección B y tokens (T2, T3); enrutamiento 1–7 (T5, T6, T10: URLs, layout, SEO por ruta, prerender, redirecciones, sitemap, scroll); idioma (T4); convención de UI 1–8 (T1 lint, T2 tokens/temas, T3 componentes/icono, T6 guía, T11 Bootstrap fuera); Inicio 1–6 (T8); datos y retiro fácil (T7); páginas no construidas `noindex` y `/contacto` mínima (T5, T9); anti-metas (T8 composición de servicios, sin ilustraciones de stock); cifras de ejemplo (T7). Hoja de ruta posterior (formulario, Productos, Servicios, Nosotros, CI de deploy, FAQ i18n) queda fuera por spec. Lint en CI incluido (T10); tests en CI queda para la hoja de ruta.
- **Consistencia de tipos:** `IconName` (T3) lo usan `ThemeService.icon`, `ServiceItem.icon`, header; `SeoRouteData` (T5) lo consumen las rutas; `SITE`/`CLIENTS`/`PRODUCTS`/`STATS` (T7) los consumen footer, Inicio y Contacto; `NAV_LINKS` (T6) lo consumen header y footer.
- **Proporción:** el plan decide archivos, firmas, tokens, valores del spec y pruebas; no transcribe cuerpos de código.
- **Riesgo conocido:** el prerender podría no resolver `./i18n/*.json` (T10 Step 3 trae la alternativa con `fs`). El dueño aún debe confirmar qué logos de cliente mostrar y qué proyectos retirar; el plan arranca con los dos logos que hoy se muestran.
