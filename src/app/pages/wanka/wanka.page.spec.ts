import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { WANKA_INDUSTRIES, WANKA_MODULES } from '../../data/site.data';
import { WankaPageComponent } from './wanka.page';

describe('WankaPageComponent', () => {
  let fixture: ComponentFixture<WankaPageComponent>;
  const t = es.application.wankaPage;

  function setup(platform: 'browser' | 'server' = 'browser'): WankaPageComponent {
    TestBed.configureTestingModule({
      imports: [WankaPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(WankaPageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('says plainly that it is in construction, with no sign-up, and points to /contacto', () => {
    setup();
    const el = render();
    expect(text(el.querySelector('h1'))).toBe('Wanka');
    expect(text(el.querySelector('#wanka ui-tag'))).toBe(t.intro.status);
    expect(text(el.querySelector('#wanka a[href="/contacto"]'))).toContain(t.intro.cta);
    expect(el.textContent).not.toMatch(/Crear cuenta|gratis|S\/ \d/);
  });

  it('starts the menu illustration on the first industry, with one specific menu visible', () => {
    setup('server');
    const el = render();
    const active = el.querySelectorAll('app-industry-preview .tabs__item.is-active');
    expect(active.length).toBe(1);
    expect(active[0].getAttribute('data-industry')).toBe(WANKA_INDUSTRIES[0]);
    expect(el.querySelectorAll('.menu__list--specific.is-active').length).toBe(1);
  });

  it('lists the four industries and the six shared modules', () => {
    setup();
    const el = render();
    expect(el.querySelectorAll('#rubros .industries__item').length).toBe(WANKA_INDUSTRIES.length);
    expect(Array.from(el.querySelectorAll('#modulos .modules__number')).map(n => text(n))).toEqual(
      WANKA_MODULES.map((_, i) => String(i + 1).padStart(2, '0')),
    );
  });

  it('renders the sections in order and ends with its own contact band', () => {
    setup();
    const el = render();
    expect(Array.from(el.querySelectorAll('section')).map(s => s.id)).toEqual(['wanka', 'rubros', 'modulos', 'contacto']);
    expect(el.querySelector('app-contact-band h2')?.getAttribute('aria-label')).toBe(t.contact.title);
  });

  it('has the same wankaPage keys in Spanish and English', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.wankaPage)).toEqual(keys(es.application.wankaPage));
  });

  it('renders everything visible on the server', () => {
    setup('server');
    expect(render().querySelector('[style]')).toBeNull();
  });
});
