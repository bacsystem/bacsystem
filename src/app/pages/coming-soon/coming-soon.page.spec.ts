import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import { ComingSoonPageComponent } from './coming-soon.page';

describe('ComingSoonPageComponent', () => {
  it('renders exactly one h1 with the page name', () => {
    TestBed.configureTestingModule({
      imports: [ComingSoonPageComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { headingKey: 'application.site.comingSoon.headings.products' } } } },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    const f = TestBed.createComponent(ComingSoonPageComponent);
    f.detectChanges();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(es.application.site.comingSoon.headings.products);
  });
});
