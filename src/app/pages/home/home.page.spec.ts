import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import { ClientLogo, PROCESS, PRODUCTS, SERVICES, STATS } from '../../data/site.data';
import { MotionService } from '../../shared/motion/motion.service';
import { HomePageComponent } from './home.page';

/** The intro hold from index.html (inline there, so not part of the test styles). */
const HOLD_CSS = ".motion-intro [data-intro='pending'] { opacity: 0; animation: intro-failsafe 500ms ease-out 2500ms forwards; } @keyframes intro-failsafe { to { opacity: 1; } }";
const holdStyle = document.createElement('style');

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

  it("shows the owner's subtitle under the hero title", () => {
    setup();
    const el = render();
    expect(el.querySelector('.hero__subtitle')?.textContent?.trim()).toBe(es.application.home.hero.subtitle);
  });

  it('links the hero CTA to /contacto and the secondary action to /servicios', () => {
    setup();
    const el = render();
    expect(el.querySelector('.hero__cta')?.getAttribute('href')).toBe('/contacto');
    expect(el.querySelector('.hero__secondary')?.getAttribute('href')).toBe('/servicios');
  });

  it('shows the brand graphic in the hero instead of the process or a product screen', () => {
    setup();
    const el = render();
    const hero = el.querySelector('#inicio') as HTMLElement;
    expect(hero.querySelector('app-brand-mark')).toBeTruthy();
    expect(hero.querySelector('app-product-preview')).toBeNull();
    expect(hero.querySelector('.process__step')).toBeNull();
    expect(hero.querySelector('ol')).toBeNull();
    expect(hero.textContent).not.toContain('OperaAI');
  });

  it('shows the four process steps in order in their own section', () => {
    setup();
    const el = render();
    const section = el.querySelector('#proceso') as HTMLElement;
    expect(section).toBeTruthy();
    expect(section.querySelector('h2')?.textContent?.trim()).toBe(es.application.home.process.label);
    const steps = Array.from(section.querySelectorAll('.process__step'));
    expect(steps.length).toBe(4);
    const titles = steps.map(s => s.querySelector('.process__title')?.textContent?.trim());
    const p = es.application.home.process;
    expect(titles).toEqual([p.understand.title, p.design.title, p.build.title, p.maintain.title]);
    expect(steps.map(s => s.querySelector('.process__marker')?.textContent?.trim())).toEqual(['01', '02', '03', '04']);
    expect(steps[0].querySelector('.process__text')?.textContent?.trim()).toBe(p.understand.text);
  });

  it('marks only the first process step as the starting point', () => {
    setup();
    const el = render();
    const steps = Array.from(el.querySelectorAll('#proceso .process__step'));
    expect(steps.map(s => s.classList.contains('is-current'))).toEqual([true, false, false, false]);
    expect(steps.some(s => s.hasAttribute('aria-current'))).toBeFalse();
    expect(steps[0].querySelector('ui-tag')?.textContent?.trim()).toBe(es.application.home.process.start);
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['inicio', 'servicios', 'proceso', 'productos', 'cifras', 'contacto']);
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
    expect(section.textContent).toContain('khipu');
    expect(section.textContent).not.toMatch(/OperaAI|sophIA/);
    expect(Array.from(section.querySelectorAll('ui-monogram')).map(m => m.textContent?.trim())).toEqual(['K', 'W']);
    const tags = Array.from(section.querySelectorAll('.products__name ui-tag')).map(t => t.textContent?.trim());
    expect(tags).withContext('only Wanka is marked in construction').toEqual([es.application.home.products.building]);
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
    expect(el.querySelectorAll('#servicios .services__list li').length).toBe(4);
  });

  it('links every service to its block on /servicios and the lead to the full page', () => {
    setup();
    const el = render();
    const links = Array.from(el.querySelectorAll('#servicios h3 a')).map(a => a.getAttribute('href'));
    expect(links).toEqual(SERVICES.map(s => `/servicios#${s.anchor}`));
    expect(links).toContain('/servicios#transformacion');
    expect(el.querySelector('#servicios .services__more')?.getAttribute('href')).toBe('/servicios');
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

  describe('motion', () => {
    /** Records animate calls instead of running them. */
    class FakeMotion {
      enabled = true;
      calls = 0;
      stopped = 0;
      animate = () => {
        this.calls++;
        return { stop: () => this.stopped++, finished: new Promise(() => undefined) };
      };
      matches = () => false;
      scroll = () => () => undefined;
      inViewOnce = () => ({ stop: () => undefined });
      stagger = () => 0;
      run = <T>(fn: () => T): T => fn();
    }

    /** What the head script in index.html does before first paint. */
    const html = document.documentElement;
    function flagIntro(at = performance.now()): void {
      html.classList.add('motion-intro');
      html.dataset['introAt'] = String(at);
      holdStyle.textContent = HOLD_CSS; // the inline <style> of index.html
      document.head.appendChild(holdStyle);
    }
    afterEach(() => {
      html.classList.remove('motion-intro');
      delete html.dataset['introAt'];
      holdStyle.remove();
    });

    function setupWith(motion: FakeMotion, platform: 'browser' | 'server' = 'browser'): HTMLElement {
      TestBed.configureTestingModule({
        imports: [HomePageComponent, TranslateModule.forRoot()],
        providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }, { provide: MotionService, useValue: motion }],
      });
      const translate = TestBed.inject(TranslateService);
      translate.setTranslation('es', es);
      translate.use('es');
      fixture = TestBed.createComponent(HomePageComponent);
      fixture.detectChanges();
      return fixture.nativeElement as HTMLElement;
    }

    const introParts = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('.hero__copy [data-intro]'));

    it('renders the hero fully visible on the server: intro parts pending, no inline pre-state', () => {
      const motion = new FakeMotion();
      const el = setupWith(motion, 'server');
      expect(introParts(el).length).toBe(4);
      expect(introParts(el).every(p => p.dataset['intro'] === 'pending')).toBeTrue();
      expect(el.querySelector('.hero__copy [style]')).toBeNull();
      expect(motion.calls).toBe(0);
    });

    it('keeps the h1 text intact when split into words, announced as one title', () => {
      const el = setupWith(new FakeMotion());
      const h1 = el.querySelector('h1') as HTMLElement;
      expect(h1.getAttribute('aria-label')).toBe(es.application.home.hero.title);
      expect(Array.from(h1.querySelectorAll('.ui-word')).every(w => w.getAttribute('aria-hidden') === 'true')).toBeTrue();
      expect(h1.querySelectorAll('.ui-word').length).toBe(es.application.home.hero.title.split(' ').length);
      expect(h1.textContent?.replace(/\s+/g, ' ').trim()).toBe(es.application.home.hero.title);
    });

    it('plays the hero intro in the browser and releases the CSS hold', () => {
      flagIntro();
      const motion = new FakeMotion();
      const el = setupWith(motion);
      expect(motion.calls).toBeGreaterThan(0);
      expect(introParts(el).every(p => p.dataset['intro'] === 'on')).toBeTrue();
      expect((el.querySelector('.hero__title .ui-word') as HTMLElement).style.opacity).toBe('0');
    });

    it('skips the intro when hydration comes after the failsafe already showed the hero', () => {
      flagIntro(performance.now() - 5000);
      const motion = new FakeMotion();
      const el = setupWith(motion);
      expect(introParts(el).every(p => p.dataset['intro'] === 'off')).toBeTrue();
      expect(el.querySelector('.hero__copy [style]')).toBeNull(); // never hidden again, no replay
    });

    it('skips the intro without the head-script flag (e.g. a later visit within the app)', () => {
      const el = setupWith(new FakeMotion());
      expect(introParts(el).every(p => p.dataset['intro'] === 'off')).toBeTrue();
      expect(el.querySelector('.hero__copy [style]')).toBeNull();
    });

    it('shows the hero at once with reduced motion, without animating', () => {
      const motion = new FakeMotion();
      motion.enabled = false;
      const el = setupWith(motion);
      expect(motion.calls).toBe(0);
      expect(introParts(el).every(p => p.dataset['intro'] === 'off')).toBeTrue();
      expect(el.querySelector('.hero__copy [style]')).toBeNull();
    });

    it('stops its animations on destroy', () => {
      flagIntro();
      const motion = new FakeMotion();
      setupWith(motion);
      fixture.destroy();
      expect(motion.stopped).toBeGreaterThan(0);
    });

    it('draws one connector between each pair of process markers', () => {
      const el = setupWith(new FakeMotion(), 'server');
      expect(el.querySelectorAll('#proceso .process__link').length).toBe(PROCESS.length - 1);
    });
  });
});
