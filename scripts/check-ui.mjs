import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ICON_COMPONENT = 'shared/ui/icon/icon.component.html';

function blockBody(css, selectorPattern) {
  const match = new RegExp(`${selectorPattern}\\s*\\{([^}]*)\\}`).exec(css);
  return match ? match[1] : '';
}

function colorTokens(body) {
  return new Set([...body.matchAll(/(--color-[\w-]+)\s*:/g)].map((m) => m[1]));
}

/** Every --color-* token in :root must also exist in [data-theme='dark']. */
export function checkTokenParity(css) {
  const light = colorTokens(blockBody(css, ':root'));
  const dark = colorTokens(blockBody(css, "\\[data-theme=['\"]dark['\"]\\]"));
  return [...light]
    .filter((token) => !dark.has(token))
    .map((token) => `tokens: ${token} is defined in :root but missing in [data-theme='dark']`);
}

/** Inline styles may only set custom properties (--x). */
export function checkTemplates(files) {
  const errors = [];
  for (const { path, content } of files) {
    for (const match of content.matchAll(/(?<![\w\[.-])style\s*=\s*(["'])(.*?)\1/gs)) {
      const declarations = match[2].split(';').map((d) => d.trim()).filter(Boolean);
      const bad = declarations.filter((d) => !d.startsWith('--'));
      if (bad.length) errors.push(`${path}: inline style with design values: ${bad.join('; ')}`);
    }
    for (const match of content.matchAll(/\[style\.([^\]]+)\]/g)) {
      if (!match[1].startsWith('--')) {
        errors.push(`${path}: [style.${match[1]}] binding is not a custom property`);
      }
    }
  }
  return errors;
}

/** Bootstrap Icons classes are only allowed inside the ui-icon component. */
export function checkIconUsage(files) {
  return files
    .filter(({ path }) => !path.endsWith(ICON_COMPONENT))
    .filter(({ content }) => /\bbi\s+bi-/.test(content))
    .map(({ path }) => `${path}: use <ui-icon> instead of bi bi-* classes`);
}

/** Component styles must live in .css files (styleUrl), not inline `styles:` in the decorator. */
export function checkInlineStyles(files) {
  return files
    .filter(({ path }) => path.endsWith('.ts') && !path.endsWith('.spec.ts'))
    .filter(({ content }) => /(?<![\w.])styles\s*:\s*[\[`'"]/.test(content))
    .map(({ path }) => `${path}: inline component styles are not allowed; use styleUrl with a .css file`);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function main() {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const errors = [];
  const tokensPath = join(root, 'src/styles/tokens.css');
  if (existsSync(tokensPath)) {
    errors.push(...checkTokenParity(readFileSync(tokensPath, 'utf8')));
  } else {
    errors.push('src/styles/tokens.css not found');
  }
  const appDir = join(root, 'src/app');
  const files = existsSync(appDir)
    ? walk(appDir)
        .filter((f) => f.endsWith('.html'))
        .map((f) => ({ path: relative(root, f), content: readFileSync(f, 'utf8') }))
    : [];
  const tsFiles = existsSync(appDir)
    ? walk(appDir)
        .filter((f) => f.endsWith('.ts'))
        .map((f) => ({ path: relative(root, f), content: readFileSync(f, 'utf8') }))
    : [];
  errors.push(...checkTemplates(files), ...checkIconUsage(files), ...checkInlineStyles(tsFiles));
  errors.forEach((e) => console.error(e));
  if (errors.length) process.exit(1);
  console.log('check-ui: OK');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
