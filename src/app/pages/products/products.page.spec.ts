import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { PRODUCTS } from '../../data/site.data';
import { ProductsPageComponent } from './products.page';

describe('ProductsPageComponent', () => {
  let fixture: ComponentFixture<ProductsPageComponent>;
  const t = es.application.productsPage;

  function setup(platform: 'browser' | 'server' = 'browser'): ProductsPageComponent {
    TestBed.configureTestingModule({
      imports: [ProductsPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(ProductsPageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('renders one h1 and a card per product with its real status and a link to its page', () => {
    setup();
    const el = render();
    expect(el.querySelectorAll('h1').length).toBe(1);
    const cards = Array.from(el.querySelectorAll('.product'));
    expect(cards.length).toBe(PRODUCTS.length);
    expect(cards.map(c => text(c.querySelector('ui-tag')))).toEqual([t.status.available, t.status.building]);
    for (const product of PRODUCTS) {
      expect(el.querySelector(`.product a[href="${product.route}"]`)).withContext(product.id).toBeTruthy();
    }
  });

  it('uses the shared monogram when a product has no logo', () => {
    setup();
    const el = render();
    expect(Array.from(el.querySelectorAll('.product ui-monogram')).map(m => text(m))).toEqual(['k', 'W']);
  });

  it('does not repeat the Home teaser lines', () => {
    for (const id of ['khipu', 'wanka'] as const) {
      expect(t.items[id].summary).not.toBe(es.application.home.products[id].tagline);
    }
  });

  it('has the same productsPage keys in Spanish and English', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.productsPage)).toEqual(keys(es.application.productsPage));
  });

  it('renders everything visible on the server', () => {
    setup('server');
    expect(render().querySelector('[style]')).toBeNull();
  });
});
