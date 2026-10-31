// Cloudflare Pages answers unknown URLs with /404.html (and a 404 status) when that file exists.
// Angular prerenders the not-found route to 404/index.html, so move it to the root as 404.html.
import { existsSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'dist', 'browser');
const prerendered = join(out, '404', 'index.html');
if (!existsSync(prerendered)) {
  console.error('copy-404: dist/browser/404/index.html not found (is the "404" route prerendered?)');
  process.exit(1);
}
renameSync(prerendered, join(out, '404.html'));
rmSync(join(out, '404'), { recursive: true, force: true });
console.log('copy-404: dist/browser/404.html ready');
