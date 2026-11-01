import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { SERVICE_DETAILS } from '../../data/site.data';
import { ServicesPageComponent } from './services.page';

describe('ServicesPageComponent', () => {
  let fixture: ComponentFixture<ServicesPageComponent>;
  const t = es.application.servicesPage;
  const anchors = ['desarrollo', 'consultoria', 'transformacion', 'optimizacion', 'nube'];

  function setup(platform: 'browser' | 'server' = 'browser'): ServicesPageComponent {
    TestBed.configureTestingModule({
      imports: [ServicesPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(ServicesPageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();
  const blocks = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('.service'));

  it('renders exactly one h1 with the page statement and the lead', () => {
    setup();
    const el = render();
    const h1s = el.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(text(h1s[0])).toBe(t.intro.title);
    expect(h1s[0].getAttribute('aria-label')).toBe(t.intro.title);
    const lead = text(el.querySelector('.intro__lead')) ?? '';
    expect(lead).toBe(t.intro.lead);
    expect(t.intro.title).not.toBe(es.application.home.services.title);
  });

  it('keeps the h1 short (the display face wraps badly past ~32 characters)', () => {
    expect(t.intro.title.length).toBeLessThanOrEqual(32);
    expect(en.application.servicesPage.intro.title.length).toBeLessThanOrEqual(32);
  });

  it('indexes the five services in the intro, each linking to its block', () => {
    setup();
    const el = render();
    const links = Array.from(el.querySelectorAll('.intro__index a'));
    expect(links.map(a => a.getAttribute('href'))).toEqual(anchors.map(a => `/servicios#${a}`));
    expect(text(links[2].querySelector('.intro__index-title'))).toBe(t.services.transformation.title);
  });

  it('renders one block per service, in order, each with its anchor id, number and h2', () => {
    setup();
    const el = render();
    const items = blocks(el);
    expect(SERVICE_DETAILS.length).toBe(5);
    expect(items.map(b => b.id)).toEqual(anchors);
    expect(items.map(b => text(b.querySelector('.service__number')))).toEqual(['01', '02', '03', '04', '05']);
    expect(items.every(b => b.querySelector('.service__number')?.getAttribute('aria-hidden') === 'true')).toBeTrue();
    expect(text(items[0].querySelector('h2'))).toBe(t.services.web.title);
    expect(text(items[1].querySelector('.service__summary'))).toBe(t.services.consulting.summary);
  });

  it('alternates the layout from block to block (not a row of identical cards)', () => {
    setup();
    const el = render();
    expect(blocks(el).map(b => b.classList.contains('service--flip'))).toEqual([false, true, false, true, false]);
    expect(el.querySelector('.service ui-card, .service .ui-card')).toBeNull();
  });

  it('lists 2–3 situations it fits and 3–4 concrete deliverables per service, under their labels', () => {
    setup();
    const el = render();
    for (const block of blocks(el)) {
      const fit = block.querySelectorAll('.service__fit li');
      const deliverables = block.querySelectorAll('.service__deliverables li');
      expect(fit.length).withContext(block.id).toBeGreaterThanOrEqual(2);
      expect(fit.length).withContext(block.id).toBeLessThanOrEqual(3);
      expect(deliverables.length).withContext(block.id).toBeGreaterThanOrEqual(3);
      expect(deliverables.length).withContext(block.id).toBeLessThanOrEqual(4);
      const labels = Array.from(block.querySelectorAll('h3')).map(h => text(h));
      expect(labels).withContext(block.id).toEqual([t.labels.fit, t.labels.deliverables]);
    }
    const cloud = blocks(el)[4];
    expect(text(cloud.querySelector('.service__fit li'))).toBe(t.services.cloud.fit.server);
  });

  it('does not repeat the process or the products teaser that live on Home', () => {
    setup();
    const el = render();
    expect(el.querySelector('#proceso')).toBeNull();
    expect(el.querySelector('#productos')).toBeNull();
  });

  it('does not repeat the Home service descriptions in the summaries', () => {
    const home = es.application.home.services as Record<string, { description?: string }>;
    for (const [id, service] of Object.entries(t.services)) {
      const homeText = home[id]?.description;
      if (homeText) expect(service.summary).withContext(id).not.toContain(homeText.split(/[.:]/)[0]);
    }
  });

  it('ends with the shared contact band linking to /contacto', () => {
    setup();
    const el = render();
    expect(el.querySelector('app-contact-band #contacto a[href="/contacto"]')).toBeTruthy();
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['servicios', 'detalle', 'contacto']);
  });

  it('renders everything visible on the server (no inline pre-state)', () => {
    setup('server');
    const el = render();
    expect(el.querySelector('[style]')).toBeNull();
    expect(el.querySelector('.is-motion-pending')).toBeNull();
  });

  it('has the same servicesPage keys in Spanish and English, and no superseded legacy copy', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.servicesPage)).toEqual(keys(es.application.servicesPage));
    for (const lang of [es, en]) {
      expect('services' in lang.application).withContext('legacy application.services').toBeFalse();
      expect('comingSoon' in lang.application.site).withContext('coming-soon copy').toBeFalse();
    }
  });

  it('never uses the banned clichés in its copy', () => {
    const banned =
      /innovador|vanguardia|clase mundial|soluciones integrales|siguiente nivel|potencia|sinergia|excelencia|líder(es)? en|disruptiv|redefin/i;
    expect(banned.test(JSON.stringify(es.application.servicesPage))).toBeFalse();
    const bannedEn = /innovative|cutting[- ]edge|world[- ]class|end-to-end solutions|next level|empower|synerg|excellence|disrupt/i;
    expect(bannedEn.test(JSON.stringify(en.application.servicesPage))).toBeFalse();
  });

  it('promises no prices, timelines or guarantees', () => {
    const risky = /S\/|\$|USD|\d+\s*(horas|días|semanas|meses|%)|garantiza|garantía/i;
    expect(risky.test(JSON.stringify(es.application.servicesPage))).toBeFalse();
    expect(/\$|USD|\d+\s*(hours|days|weeks|months|%)|guarantee/i.test(JSON.stringify(en.application.servicesPage))).toBeFalse();
  });
});
