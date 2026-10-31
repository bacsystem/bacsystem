import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import { ClientLogo, PRODUCTS, STATS } from '../../data/site.data';
import { HomePageComponent } from './home.page';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;

  function setup(platform: 'browser' | 'server' = 'browser'): HomePageComponent {
    TestBed.configureTestingModule({
      imports: [HomePageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(HomePageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a single h1 with the hero title', () => {
    setup();
    const el = render();
    const h1s = el.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(es.application.home.hero.title);
  });

  it('links the hero CTA to /contacto and the secondary action to /servicios', () => {
    setup();
    const el = render();
    expect(el.querySelector('.hero__cta')?.getAttribute('href')).toBe('/contacto');
    expect(el.querySelector('.hero__secondary')?.getAttribute('href')).toBe('/servicios');
  });

  it('shows the work process in the hero instead of a product screen', () => {
    setup();
    const el = render();
    const hero = el.querySelector('#inicio') as HTMLElement;
    expect(hero.querySelector('app-product-preview')).toBeNull();
    const steps = Array.from(hero.querySelectorAll('.process__step'));
    expect(steps.length).toBe(4);
    const titles = steps.map(s => s.querySelector('.process__title')?.textContent?.trim());
    const p = es.application.home.process;
    expect(titles).toEqual([p.understand.title, p.design.title, p.build.title, p.maintain.title]);
    expect(hero.textContent).not.toContain('OperaAI');
  });

  it('marks only the first process step as the starting point', () => {
    setup();
    const el = render();
    const steps = Array.from(el.querySelectorAll('#inicio .process__step'));
    expect(steps.map(s => s.classList.contains('is-current'))).toEqual([true, false, false, false]);
    expect(steps.some(s => s.hasAttribute('aria-current'))).toBeFalse();
    expect(steps[0].querySelector('ui-tag')?.textContent?.trim()).toBe(es.application.home.process.start);
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['inicio', 'servicios', 'productos', 'cifras', 'contacto']);
  });

  it('shows one visible logo per client when clients are added', () => {
    const page = setup();
    page.clients = [
      { id: 'a', name: 'A', logo: '/a.png' },
      { id: 'b', name: 'B', logo: '/b.png' },
    ];
    const el = render();
    const imgs = el.querySelectorAll('#clientes img:not([aria-hidden="true"])');
    expect(imgs.length).toBe(2);
  });

  it('duplicates the logo track as decorative only when it scrolls', () => {
    const page = setup();
    const many: ClientLogo[] = Array.from({ length: 6 }, (_, i) => ({ id: `c${i}`, name: `C${i}`, logo: '/x.png' }));
    page.clients = many;
    const el = render();
    expect(el.querySelector('.clients__track')?.classList).toContain('is-scrolling');
    expect(el.querySelectorAll('#clientes img:not([aria-hidden="true"])').length).toBe(6);
    expect(el.querySelector('#clientes [aria-hidden="true"]')).toBeTruthy();
  });

  it('removes the clients section when there are no clients', () => {
    const page = setup();
    page.clients = [];
    const el = render();
    expect(el.querySelector('#clientes')).toBeNull();
  });

  it('lists every product with its name and a link to its page', () => {
    setup();
    const el = render();
    const section = el.querySelector('#productos') as HTMLElement;
    const items = section.querySelectorAll('.products__item');
    expect(items.length).toBe(PRODUCTS.length);
    expect(section.textContent).toContain('OperaAI');
    expect(section.textContent).toContain('sophIA');
    for (const product of PRODUCTS) {
      expect(section.querySelector(`a[href="${product.route}"]`)).toBeTruthy();
    }
  });

  it('keeps product detail out of the home page', () => {
    setup();
    const el = render();
    expect(el.querySelector('app-product-preview')).toBeNull();
    expect(el.textContent).not.toContain('Facturas, boletas y notas de crédito');
    expect(el.textContent).not.toContain('Factura electrónica');
  });

  it('removes the products section when there are no products', () => {
    const page = setup();
    page.products = [];
    const el = render();
    expect(el.querySelector('#productos')).toBeNull();
  });

  it('lays out services as one lead item and a numbered list of the rest', () => {
    setup();
    const el = render();
    expect(el.querySelector('#servicios .services__lead h3')?.textContent).toContain(es.application.home.services.web.title);
    expect(el.querySelectorAll('#servicios .services__list li').length).toBe(3);
  });

  it('renders the final counter values on the server', () => {
    setup('server');
    const el = render();
    const values = Array.from(el.querySelectorAll('#cifras .stats__value')).map(v => v.textContent?.trim());
    expect(values).toEqual(STATS.map(s => String(s.value)));
  });

  it('renders the final counter values with reduced motion', () => {
    setup();
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const el = render();
    const values = Array.from(el.querySelectorAll('#cifras .stats__value')).map(v => v.textContent?.trim());
    expect(values).toEqual(STATS.map(s => String(s.value)));
  });

  it('renders the 24/7 stat statically, without count-up', () => {
    setup();
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    const el = render();
    const items = Array.from(el.querySelectorAll('#cifras .stats__figure'));
    expect(items[items.length - 1].textContent?.replace(/\s+/g, '')).toBe('24/7');
  });

  it('never shows the retired figures', () => {
    setup();
    const text = render().textContent ?? '';
    expect(text).not.toContain('150+');
    expect(text).not.toContain('320+');
  });

  it('links the contact band to /contacto', () => {
    setup();
    const el = render();
    expect(el.querySelector('#contacto a[href="/contacto"]')).toBeTruthy();
  });
});
