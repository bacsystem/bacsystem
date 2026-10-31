import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { KHIPU_DOCUMENTS } from '../../data/site.data';
import { KhipuPageComponent } from './khipu.page';

describe('KhipuPageComponent', () => {
  let fixture: ComponentFixture<KhipuPageComponent>;
  const t = es.application.khipuPage;

  function setup(platform: 'browser' | 'server' = 'browser'): KhipuPageComponent {
    TestBed.configureTestingModule({
      imports: [KhipuPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(KhipuPageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('renders one h1 with the product name, its tagline and the access CTA to /contacto', () => {
    setup();
    const el = render();
    const h1s = el.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(text(h1s[0])).toBe('khipu');
    expect(text(el.querySelector('.intro__tagline'))).toBe(t.intro.tagline);
    expect(text(el.querySelector('#khipu a[href="/contacto"]'))).toContain(t.intro.cta);
  });

  it('shows the invoice illustration accepted, with the four send steps done (final state)', () => {
    setup('server');
    const el = render();
    const preview = el.querySelector('app-invoice-preview .preview') as HTMLElement;
    expect(preview.classList).toContain('is-accepted');
    expect(preview.getAttribute('role')).toBe('img');
    const steps = el.querySelectorAll('.flow__step');
    expect(steps.length).toBe(4);
    expect(Array.from(steps).every(s => s.classList.contains('is-done'))).toBeTrue();
  });

  it('splits how it works into setup once and the two steps repeated per document, numbered 01–04', () => {
    setup();
    const el = render();
    const groups = Array.from(el.querySelectorAll('#como-funciona .how__group'));
    expect(groups.map(g => text(g.querySelector('.how__when')))).toEqual([t.how.when.once, t.how.when.each]);
    expect(groups.map(g => g.querySelectorAll('.how__step').length)).toEqual([2, 2]);
    expect(Array.from(el.querySelectorAll('.how__number')).map(n => text(n))).toEqual(['01', '02', '03', '04']);
  });

  it('marks each SUNAT document as available or in progress, as the khipu develop branch has it', () => {
    setup();
    const el = render();
    const items = Array.from(el.querySelectorAll('#comprobantes .documents__item'));
    expect(items.length).toBe(KHIPU_DOCUMENTS.length);
    const available = KHIPU_DOCUMENTS.filter(d => d.available).map(d => d.id);
    expect(available).toEqual(['invoice', 'receipt', 'creditNote', 'debitNote', 'dailySummary', 'voiding']);
    const soon = items.filter(i => i.classList.contains('is-soon')).map(i => text(i.querySelector('.documents__name')));
    expect(soon).toEqual([t.documents.items.dispatchGuide, t.documents.items.withholding]);
  });

  it('ends with a beta-access contact band instead of the custom-software pitch', () => {
    setup();
    const el = render();
    const band = el.querySelector('app-contact-band #contacto') as HTMLElement;
    expect(band.querySelector('h2')?.getAttribute('aria-label')).toBe(t.contact.title);
    expect(text(band.querySelector('a[href="/contacto"]'))).toContain(t.contact.cta);
    expect(band.textContent).not.toContain(es.application.home.contact.title);
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['khipu', 'como-funciona', 'beneficios', 'para-quien', 'comprobantes', 'contacto']);
  });

  it('does not repeat the Home teaser or publish claims the product does not back', () => {
    const home = es.application.home.products.khipu.tagline;
    expect(JSON.stringify(t)).not.toContain(home);
    for (const lang of [es, en]) {
      const copy = JSON.stringify(lang.application.khipuPage);
      expect(copy).not.toMatch(/a la primera|first time|cero rechazos|zero rejections|SOC 2|99[.,]\d/i);
      expect(copy).not.toMatch(/\bOSE\b/);
    }
  });

  it('has the same khipuPage keys in Spanish and English', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.khipuPage)).toEqual(keys(es.application.khipuPage));
  });

  it('renders everything visible on the server (no inline pre-state)', () => {
    setup('server');
    const el = render();
    expect(el.querySelector('[style]')).toBeNull();
  });
});
