# Rediseño de Bacsystem Solutions: diseño

Fecha: 2026-10-30. Alcance de este documento: base común + página Inicio (fase 1) y la hoja de ruta de las demás páginas.

## Intención y por qué

El sitio actual (Angular 18, landing de una sola página, tema oscuro) no le gusta al dueño: se ve como plantilla genérica, el contenido se apaga al hacer scroll, el menú flotante inferior se equivoca de sección, los números se contradicen (hero: "150+ clientes, 320+ proyectos"; estadísticas: "2+ y 2+") y el formulario de contacto no envía nada. Además, aunque tiene rutas de Angular, todas redirigen a `/public/home`: en la práctica hay una sola URL y el HTML inicial sale vacío (SSR sin activar).

El dueño quiere un sitio más bonito y más dinámico, construido con IA pero que no parezca hecho con IA.

## Metas

- Interfaz rediseñada en la **dirección B: clara y cercana**. Fondo blanco/casi blanco, navy `#1B3080` para texto y botones, teal `#41B7A8` solo como acento, esquinas redondeadas, sombras suaves, mucho espacio.
- Sitio de varias páginas con URLs reales y limpias.
- Dinámico con propósito: tarjetas que aparecen al hacer scroll, hover con elevación, contadores animados, carrusel de logos, vista previa de producto en el hero. Nada decorativo.
- Contenido consistente, sin cifras contradictorias.
- Cada página indexable con su propio título, descripción y canonical.
- Fácil de mantener: productos y clientes en un único archivo de datos; retirar un proyecto es borrar una entrada.

## No metas

- No se rehace el backend ni se agrega uno propio (el formulario de contacto es de otra fase).
- No URLs por idioma (`/en`, `/es`): se mantiene el selector actual.
- No se implementan aún las páginas Servicios, Productos, Nosotros y Contacto (ver hoja de ruta).

## Anti-metas (fracasa aunque "funcione")

El resultado no debe parecer plantilla de IA:
- Sin degradados llamativos, brillos ni tarjetas de vidrio.
- Sin filas de tarjetas idénticas con icono en cuadrado de color.
- Sin frases genéricas ("transformamos ideas", "soluciones innovadoras").
- Sin iconos de relleno; sin ilustraciones de stock.
- Sin cifras inventadas presentadas como reales.

## Decisiones del dueño

- Dirección visual **B** (clara y cercana), con navy y teal de la marca.
- Estructura de páginas: Inicio, Servicios, Productos (una página por producto: OperaAI y sophIA), Nosotros, Contacto.
- Orden: Inicio y base primero, luego Contacto, Productos, Servicios, Nosotros.
- Idioma: **mantener el selector actual; español por defecto**.
- Usar los logos reales ya existentes. Las capturas de producto **no existen aún**: se agregarán después. Lo demás (fotos de equipo, cifras, casos) va como ejemplo.
- Algunos proyectos se van a retirar: el contenido debe ser fácil de quitar.

## Enrutamiento (decisión de arquitectura acordada)

1. URLs: `/`, `/servicios`, `/productos`, `/productos/operaai`, `/productos/sophia`, `/nosotros`, `/contacto`. Se elimina el prefijo `/public`. Carga diferida por página.
2. Un layout padre con cabecera y pie. El menú usa `routerLink` y `routerLinkActive`; se elimina el `IntersectionObserver`, `scrollIntoView` con `setTimeout` y `ScrollNavService`.
3. SEO por ruta: título, descripción y canonical declarados en los datos de cada ruta y aplicados por `SeoService` al navegar y al cambiar de idioma.
4. Prerender en build (Angular 18) por ruta, desplegado estático en Cloudflare Pages. Se elimina `server.ts`, `express` y el script `serve:ssr`.
5. Redirecciones de URLs antiguas (`/public/home`, `/public/about`, etc.) a las nuevas.
6. `sitemap.xml` con todas las páginas. Como no hay URLs por idioma, se quitan los `hreflang` falsos.
7. Scroll: al cambiar de página vuelve arriba; los anclajes dentro de una página usan el soporte nativo del router.

## Convención de UI (requisito del dueño)

Toda la página usa los mismos iconos, botones, tarjetas, etiquetas y espaciados, y no puede haber valores escritos a mano en el CSS de los componentes ni en los temas.

Punto de partida medido: el CSS actual tiene unos 330 colores hexadecimales, 400 `rgb/rgba` y 213 tamaños de fuente en px repartidos por ~6.100 líneas de CSS de componentes. Eso es lo que se elimina.

Reglas:
1. **Tokens como única fuente de valores.** Un solo archivo de tokens (CSS variables) define color, tipografía (familia, tamaños, pesos, interlineado), espaciado, radios, sombras, bordes, z-index, duraciones y curvas de animación y puntos de corte. Los colores se definen en dos capas: primitivos (`--navy-700`, `--teal-500`) y semánticos (`--color-text`, `--color-surface`, `--color-primary`, `--color-accent`, `--color-border`). Los componentes solo consumen tokens semánticos.
2. **Temas = reasignar tokens semánticos.** Claro (por defecto) y oscuro se definen únicamente como sobrescritura de los tokens semánticos bajo `[data-theme]`. Ningún componente tiene reglas `.dark-mode` ni colores propios por tema. Agregar un tema nuevo es agregar un bloque de tokens.
3. **Biblioteca de componentes compartidos** (standalone, en una carpeta `shared/ui`): botón (variantes primario, secundario y texto; tamaños), tarjeta, etiqueta, encabezado de sección, icono, contenedor de sección y campo de formulario. Las páginas componen estos componentes; no recrean estilos propios de botón o tarjeta.
4. **Un solo set de iconos** y un componente `Icon` que lo envuelve. Se elige un set (por ejemplo Bootstrap Icons, que ya está en el proyecto) y se usa por nombre; no se mezclan sets ni se usan emojis o SVG sueltos. Solo se cargan los iconos usados.
5. **Prohibido por convención:** colores literales (`#`, `rgb`, `hsl`, nombres de color), `px` para fuentes y espaciado fuera de los tokens, `!important`, y estilos en línea con valores de diseño. Cada componente declara su CSS solo con `var(--...)`.
6. **Se hace cumplir, no solo se pide:** regla de Stylelint (`color-no-hex`, `declaration-property-value-disallowed-list`, o equivalente) que falla el lint ante valores literales fuera del archivo de tokens, ejecutada en CI.
7. **Documentación viva:** una página interna `/guia-ui` (no indexable y excluida del sitemap, solo en desarrollo) muestra los tokens, botones, tarjetas e iconos, para revisar la consistencia de un vistazo.
8. **Se sustituye el CSS heredado:** Bootstrap completo y las hojas de la plantilla original dejan de usarse para estilos; se conserva solo lo que se justifique (por ejemplo la rejilla) y sus valores pasan por los tokens.

Esta base se construye primero, antes de cualquier página, porque el resto del trabajo depende de ella.

## Idioma

Selector EN/ES actual con ngx-translate. Idioma por defecto: español (hoy es inglés). Se guarda la elección del usuario en el navegador. El prerender genera el HTML en español.

## Fase 1: base + Inicio

Base común:
- Tokens de diseño (colores, tipografía, radios, sombras, espaciado) en CSS variables, tema claro por defecto; el modo oscuro opcional se mantiene como en `ThemeService`, pero el claro es el predeterminado.
- Cabecera fija simple (logo horizontal de color, menú, selector ES/EN, botón "Cotizar proyecto"), pie de página y componentes reutilizables (botón, tarjeta, sección con título, etiqueta).
- Tipografía con carácter: se evalúa usar las fuentes ya incluidas en el repo (Caviar Dreams, Elemental End) para títulos y una sans sobria para lectura. Se evita Poppins/Raleway/Roboto por defecto. Elección final queda al builder, validada contra el logo (tipografía cuadrada y ancha).
- Se eliminan los menús y servicios de la versión anterior que ya no se usen, y los vendors no utilizados.

Inicio (secciones, de arriba hacia abajo). **Revisado 2026-10-30 por el dueño:** la portada habla de Bacsystem como empresa de software a medida; el detalle de los productos va en Productos.
1. Hero: titular concreto en español peruano, subtítulo con la frase del dueño ("Somos el complemento estratégico de nuestros clientes, brindando soluciones tecnológicas y corporativas que impulsan su crecimiento y fortalecen su competitividad."), botón "Cotizar proyecto" y enlace a servicios; a la derecha un **gráfico de marca** hecho con las formas del isotipo (la "C" navy y el cuadrado teal) que cuenta la idea del dueño: la "C" navy es la empresa cliente y la pieza teal es Bacsystem, el complemento que le falta; al cargar la pieza teal entra y encaja en el hueco (movimiento suave, desactivado con reduced motion). Sin personas, sin código, sin datos inventados. Es provisional hasta tener la imagen definitiva (prompt en `docs/prompt/gemini-hero-image.md`).
   - El proceso (entender → diseñar → construir → mantener) deja el hero y pasa a una sección propia compacta después de "Qué hacemos".
2. Qué hacemos: resumen de servicios con layout no repetitivo (no una fila de cuatro tarjetas iguales).
3. Productos propios: franja corta con todos los productos de `PRODUCTS` (hoy OperaAI y sophIA) lado a lado: logo, nombre, una línea y enlace "Ver producto" a su página. Sin factura ni detalle.
4. Cifras: contadores animados con datos de ejemplo claramente marcados.
5. Banda final de contacto.

Sin franja "Confían en nosotros" hasta tener logos reales de clientes (`client-7.png`/`client-8.png` eran los logos de OperaAI y sophIA, no clientes). La sección sigue soportada por datos: reaparece al agregar entradas a `CLIENTS`.

Para la fase de Productos: la ilustración de facturación de OperaAI (panel de comprobantes y factura de ejemplo) y el bloque de producto destacado se retiran de Inicio y se recuperan desde el commit `cfe0f88` (`src/app/pages/home/product-preview/` y la sección `featured` de `home.page.*`) para `/productos/operaai`.

Contenido de ejemplo (cifras, textos de casos, fotos de equipo) se identifica con un comentario `EJEMPLO` y vive en el archivo de datos para sustituirlo fácil. Las cifras de ejemplo no deben contradecirse entre sí ni con el SEO.

## Dónde va cada información (sin duplicados)

Regla del dueño (2026-10-31): lo que aparece en Inicio no se repite en otra página; cada idea vive en un solo lugar.

| Información | Dónde vive | Notas |
|---|---|---|
| Frase del dueño ("Somos el complemento estratégico…") | Inicio (hero) | Nosotros explica el concepto de la pieza verde con otras palabras |
| Resumen de servicios (una línea cada uno) | Inicio | Cada uno enlaza a su bloque en Servicios |
| Detalle de servicios (te sirve si / qué recibes) | Servicios | Los resúmenes no repiten las líneas de Inicio |
| Proceso "Así trabajamos contigo" | Solo Inicio | |
| Productos (nombre + una línea) | Inicio | El detalle irá en /productos; Servicios no repite el bloque |
| Cifras | Solo Inicio | |
| "Hablas con quienes construyen" | Nosotros (dato "Con quién hablas") | |
| Misión, visión, valores, equipo | Solo Nosotros | |
| Correo, teléfono, dirección | Footer y Contacto | La banda de contacto solo lleva el botón |
| Banda de contacto (CTA) | Al final de cada página salvo Contacto | Es una acción, no información; se repite a propósito |

## Restricciones

- Angular 18, componentes standalone, yarn, despliegue en Cloudflare Pages vía GitHub Actions (`dist/browser`).
- Las ilustraciones `home.png`, `hero-img.png` y `main/hero-img.png` (stock isométrico naranja/rosa) no se usan.
- Logos de Bacsystem disponibles en 9 variantes en `public/assets/img/bacsystem/`.
- Debe verse bien en móvil (el menú en móvil se rediseña).
- Respetar `prefers-reduced-motion`.

## Hoja de ruta posterior (fuera de la fase 1)

2. Contacto: formulario que envíe de verdad (servicio por definir) y enlace a WhatsApp.
3. Productos: página índice y una por producto; hoy sin capturas, con marcadores de posición.
4. Servicios.
5. Nosotros y equipo.
Aparte: limpiar CI (deploy solo desde `main`, previews para PR, correr tests), borrar `docs/notes.txt` y `docs/tmp.txt`, internacionalizar los FAQ de productos que hoy están en español en el código.

## Fuentes de contenido y decisiones menores (respuestas a la revisión)

Respondido por el proyecto actual:
- **Fuente de verdad del contenido:** `public/i18n/es.json` y `en.json` (textos actuales), y los datos de contacto de `contact.component.ts` (email bacsystem.sac@gmail.com, teléfono +51 907 892 868, dirección "Av. B 200 Lima"). Servicios actuales: desarrollo web, consultoría, optimización y cloud. Productos: OperaAI y sophIA.
- **Cifras antiguas** ("150+ clientes", "320+ proyectos" vs "2+ y 2+"): ninguna se trata como real. Todas pasan a ser cifras de ejemplo marcadas hasta que el dueño confirme las verdaderas.
- **Dominio y canonical:** `https://bacsystemsolutions.com` (ya usado en `SeoService`).

Decisiones del builder (marcadas como criterio propio, ajustables):
- **"Cotizar proyecto":** en la fase 1 apunta a `/contacto`, que existe como página mínima real con los datos de contacto (email, teléfono y WhatsApp si se confirma el número). Las demás rutas aún no construidas (`/servicios`, `/productos*`, `/nosotros`) existen como páginas marcadas `noindex` y fuera del sitemap hasta que se construyan.
- **Redirecciones de URLs antiguas:** archivo `_redirects` de Cloudflare Pages (`/public/home`, `/public/about`, `/public/services`, `/public/products`, `/public/team`, `/public/contact` y `/public` hacia las nuevas rutas); no del router de Angular.
- **Modo oscuro:** debe seguir funcionando con los mismos tokens; no se rediseña a fondo en la fase 1 y no recibe QA visual extenso.
- **Navegadores:** versiones actuales de Chrome, Safari, Firefox y Edge; móviles desde 360 px de ancho.
- **Código "no usado":** lo determina el builder verificando referencias antes de borrar. Los tests existentes (`*.spec.ts`) se mantienen pasando o se actualizan; se agregan pruebas básicas para el enrutamiento y `SeoService`. Agregar los tests al CI queda en la hoja de ruta.
- **Fuentes:** el builder verifica formato y licencia de uso web de Caviar Dreams y Elemental End antes de usarlas; si no son aptas, elige alternativas con licencia libre.

Pendiente del dueño: cuáles de los 8 logos de clientes se pueden mostrar públicamente y qué proyectos o clientes se retirarán.

## Qué se deja al builder

- Elección final de tipografía y paleta extendida (neutros, estados) dentro de navy/teal.
- Textos exactos de titulares y subtítulos (en español peruano, concretos, sin clichés), marcados como propuesta.
- Detalles de animación y puntos de corte responsive.
- Estructura interna de carpetas y del archivo de datos.
