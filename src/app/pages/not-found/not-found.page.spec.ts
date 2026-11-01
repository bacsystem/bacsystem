import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { NAV_LINKS } from '../../layout/nav-links';
import { NotFoundPageComponent } from './not-found.page';

describe('NotFoundPageComponent', () => {
  function render(): HTMLElement {
    TestBed.configureTestingModule({
      imports: [NotFoundPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    const f = TestBed.createComponent(NotFoundPageComponent);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  }

  it('says the page was not found in an h1 and leads back home first', () => {
    const el = render();
    expect(el.querySelector('h1')?.textContent).toContain(es.application.site.notFound.title);
    expect(el.querySelector('a[ui-button]')?.getAttribute('href')).toBe('/');
  });

  it('offers every main section as a way out', () => {
    const el = render();
    for (const link of NAV_LINKS) {
      expect(el.querySelector(`.not-found__link[href="${link.path}"]`)).withContext(link.path).toBeTruthy();
    }
  });

  it('has the same notFound keys in Spanish and English', () => {
    expect(Object.keys(en.application.site.notFound)).toEqual(Object.keys(es.application.site.notFound));
  });
});
