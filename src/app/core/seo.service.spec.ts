import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SeoService } from './seo.service';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('SeoService', () => {
  let service: SeoService;
  let translate: TranslateService;

  const meta = (sel: string) => document.head.querySelector<HTMLMetaElement>(sel)?.content;
  const canonical = () => document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent, data: { seo: { titleKey: 't', descriptionKey: 'd' } } },
          { path: 'contacto', component: DummyComponent, data: { seo: { titleKey: 't', descriptionKey: 'd' } } },
        ]),
      ],
    });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', { t: 'Titulo ES', d: 'Descripcion ES' });
    translate.setTranslation('en', { t: 'Title EN', d: 'Description EN' });
    translate.use('es');
    service = TestBed.inject(SeoService);
  });

  it('applies title, canonical and index robots', () => {
    service.apply({ titleKey: 't', descriptionKey: 'd' }, '/contacto');
    expect(document.title).toBe('Titulo ES');
    expect(canonical()).toBe('https://bacsystemsolutions.com/contacto/');
    expect(meta('meta[name="robots"]')).toBe('index, follow');
    expect(meta('meta[name="description"]')).toBe('Descripcion ES');
    expect(meta('meta[property="og:url"]')).toBe('https://bacsystemsolutions.com/contacto/');
    expect(meta('meta[property="og:locale"]')).toBe('es_PE');
  });

  it('uses noindex when indexable is false', () => {
    service.apply({ titleKey: 't', descriptionKey: 'd', indexable: false }, '/servicios');
    expect(meta('meta[name="robots"]')).toBe('noindex, nofollow');
  });

  it('canonical for root keeps the trailing slash', () => {
    service.apply({ titleKey: 't', descriptionKey: 'd' }, '/');
    expect(canonical()).toBe('https://bacsystemsolutions.com/');
  });

  it('strips trailing slash, query and fragment from canonical', () => {
    service.apply({ titleKey: 't', descriptionKey: 'd' }, '/contacto/?a=1#x');
    expect(canonical()).toBe('https://bacsystemsolutions.com/contacto/');
  });

  it('reapplies on navigation and on language change', async () => {
    service.init();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/contacto');
    expect(document.title).toBe('Titulo ES');
    expect(canonical()).toBe('https://bacsystemsolutions.com/contacto/');

    translate.use('en');
    expect(document.title).toBe('Title EN');
    expect(document.documentElement.lang).toBe('en');
    expect(meta('meta[property="og:locale"]')).toBe('en_US');
  });
});
