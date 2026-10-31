import { Route } from '@angular/router';
import { routes } from './app.routes';
import { SeoRouteData } from './core/seo.service';

describe('routes', () => {
  const layout = routes.find(r => r.children)!;
  const children = layout.children as Route[];
  const find = (p: string) => children.find(r => r.path === p);
  const seo = (p: string) => (find(p)?.data as { seo: SeoRouteData }).seo;

  it('has a layout parent', () => {
    expect(layout).toBeTruthy();
    expect(layout.loadComponent).toBeDefined();
  });

  it('home and contact are indexable', () => {
    for (const p of ['', 'contacto']) {
      expect(find(p)).withContext(p).toBeDefined();
      expect(seo(p).indexable ?? true).withContext(p).toBeTrue();
    }
  });

  it('unbuilt pages exist and are noindex', () => {
    for (const p of ['servicios', 'productos', 'productos/operaai', 'productos/sophia', 'nosotros']) {
      expect(find(p)).withContext(p).toBeDefined();
      expect(seo(p).indexable).withContext(p).toBeFalse();
    }
  });

  it('wildcard redirects to root', () => {
    const w = children.find(r => r.path === '**');
    expect(w?.redirectTo).toBe('');
  });

  it('no route starts with public', () => {
    for (const r of [...routes, ...children]) {
      expect(r.path?.startsWith('public') ?? false).toBeFalse();
    }
  });
});
