import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import { CLIENTS, ClientLogo, PRODUCTS, STATS } from '../../data/site.data';
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

  it('links the hero CTA to /contacto and the secondary action to /productos', () => {
    setup();
    const el = render();
    expect(el.querySelector('.hero__cta')?.getAttribute('href')).toBe('/contacto');
    expect(el.querySelector('.hero__secondary')?.getAttribute('href')).toBe('/productos');
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['inicio', 'clientes', 'servicios', 'producto', 'cifras', 'contacto']);
  });

  it('shows one visible logo per client', () => {
    setup();
    const el = render();
    const imgs = el.querySelectorAll('#clientes img:not([aria-hidden="true"])');
    expect(imgs.length).toBe(CLIENTS.length);
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

  it('features the product marked as featured and links to its page', () => {
    setup();
    const el = render();
    const featured = PRODUCTS.find(p => p.featured)!;
    const section = el.querySelector('#producto') as HTMLElement;
    expect(section.textContent).toContain('OperaAI');
    expect(section.querySelector(`a[href="${featured.route}"]`)).toBeTruthy();
  });

  it('removes the product section when no product is featured', () => {
    const page = setup();
    page.featured = undefined;
    const el = render();
    expect(el.querySelector('#producto')).toBeNull();
  });

  it('lays out services as one lead item and a numbered list of the rest', () => {
    setup();
    const el = render();
    expect(el.querySelector('#servicios .services__lead h3')?.textContent).toContain('Desarrollo web');
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
