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

  it('home, contact and about are indexable', () => {
    for (const p of ['', 'contacto', 'nosotros']) {
      expect(find(p)).withContext(p).toBeDefined();
      expect(seo(p).indexable ?? true).withContext(p).toBeTrue();
    }
  });

  it('unbuilt pages exist and are noindex', () => {
    for (const p of ['servicios', 'productos', 'productos/operaai', 'productos/sophia']) {
      expect(find(p)).withContext(p).toBeDefined();
      expect(seo(p).indexable).withContext(p).toBeFalse();
    }
  });

  it('nosotros loads the about page, not the coming-soon placeholder', async () => {
    const about = find('nosotros')!;
    expect((about.data as { headingKey?: string }).headingKey).toBeUndefined();
    expect(seo('nosotros').titleKey).toBe('application.site.seo.about.title');
    const component = await (about.loadComponent as () => Promise<unknown>)();
    expect((component as { name: string }).name).toBe('AboutPageComponent');
  });

  it('guia-ui exists in dev mode, is noindex and precedes the wildcard', () => {
    // Tests run in dev mode; the route is excluded from production builds.
    expect(find('guia-ui')).toBeDefined();
    expect(seo('guia-ui').indexable).toBeFalse();
    expect(children.findIndex(r => r.path === 'guia-ui')).toBeLessThan(children.findIndex(r => r.path === '**'));
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
