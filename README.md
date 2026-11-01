# Bacsystem Solutions — Corporate Website

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/License-Private-lightgrey)

Sitio corporativo de **Bacsystem Solutions** (Angular 18, componentes standalone, prerender estático). Se despliega en Cloudflare Pages.

---

## Comandos

Requiere Node 20.19+ (CI usa 22) y yarn 1.x. Instalar con `yarn install`.

| Comando | Qué hace |
|---|---|
| `yarn start` | Servidor de desarrollo en `http://localhost:4200` |
| `yarn build:prod` | Build de producción con prerender (salida en `dist/browser`) |
| `yarn test:ci` | Specs de Karma/Jasmine en ChromeHeadless, sin watch |
| `yarn test:ui` | Pruebas del verificador de UI (`scripts/check-ui.test.mjs`) |
| `yarn lint:ui` | `stylelint` sobre todo `src/**/*.css` + `scripts/check-ui.mjs` |

## Estructura de carpetas

```
src/
  app/
    core/       servicios (idioma, tema, SEO por ruta)
    data/       site.data.ts: contenido de la web (servicios, productos, clientes, cifras)
    layout/     header, footer y layout general
    pages/      páginas: home, contact, coming-soon, ui-guide
    shared/
      ui/       componentes de UI compartidos (button, card, icon, field, section, tag...)
      directives/  reveal y count-up
  styles/       tokens.css, base.css, fonts.css
public/
  assets/       imágenes y Bootstrap Icons (solo .min.css + fuentes)
  i18n/         es.json y en.json
  _redirects, robots.txt, sitemap.xml
scripts/        check-ui.mjs y sus tests
```

## Convención de UI

- **Tokens**: `src/styles/tokens.css` es el único lugar con valores literales (colores, tamaños, espaciados, radios, sombras). El resto del CSS usa `var(--...)`. Cada token `--color-*` de `:root` debe existir también en `[data-theme='dark']`.
- **Componentes**: se construyen con los componentes compartidos de `src/app/shared/ui` (importables desde `shared/ui/index.ts`); no se duplican estilos de botones, tarjetas o campos en las páginas.
- **Iconos**: un solo set (Bootstrap Icons) a través de `<ui-icon>`. Las clases `bi bi-*` solo se permiten dentro de `icon.component.html`. Sin emojis ni SVG sueltos.
- **Qué rechaza `yarn lint:ui`**: colores literales (`#`, `rgb()`, `hsl()`, nombres), `px` en `font-size`, márgenes, paddings, gaps y `border-radius` fuera de tokens, `!important`, breakpoints distintos de `48em` y `64em`, estilos en línea o `[style.x]` con valores de diseño (solo se admiten custom properties `--x`), clases `bi bi-*` fuera de `ui-icon` y tokens de color sin equivalente en el tema oscuro.

## Contenido y datos

El contenido de la web (servicios, productos, clientes, cifras) vive en `src/app/data/site.data.ts`. Las cifras, fotos de equipo y casos que son de ejemplo llevan el comentario `EJEMPLO` y deben reemplazarse por datos reales antes de publicarlos. Los textos están en `public/i18n/{es,en}.json` (español por defecto, `@ngx-translate`); ambos archivos deben tener las mismas claves. Las claves `products`, `services`, `about` y `team` se conservan para las siguientes fases.

## Prerender y despliegue

`yarn build:prod` prerenderiza las rutas estáticas con `@angular/ssr` y genera `dist/browser` (incluye `_redirects`, `robots.txt`, `sitemap.xml` y `404.html`). Se despliega en **Cloudflare Pages** publicando `dist/browser` (ver `wrangler.toml`).

**Producción se publica solo con un tag de versión** (`vX.Y.Z`); un push a `main` o un pull request no despliegan (`.github/workflows/deploy.yaml`). Para publicar:

```bash
# 1. Con main actualizado y la versión subida en package.json
git tag v1.3.0
git push origin v1.3.0
```

O desde GitHub: **Releases → Draft a new release → Choose a tag → `v1.3.0` (nuevo)** → Publish. Crear el tag dispara el despliegue. Para volver a una versión anterior, despliega de nuevo ese tag desde **Actions** (Re-run jobs del run de ese tag).

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
