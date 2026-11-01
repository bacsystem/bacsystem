import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../../public/i18n/es.json';
import { ContactBandComponent } from './contact-band.component';

describe('ContactBandComponent', () => {
  function create(platform: 'browser' | 'server' = 'browser'): HTMLElement {
    TestBed.configureTestingModule({
      imports: [ContactBandComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    const f = TestBed.createComponent(ContactBandComponent);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  }

  it('renders a primary #contacto section with the title as an h2', () => {
    const el = create();
    const section = el.querySelector('section#contacto') as HTMLElement;
    expect(section).toBeTruthy();
    expect(section.classList).toContain('ui-section--primary');
    const h2 = section.querySelector('h2') as HTMLElement;
    expect(h2.getAttribute('aria-label')).toBe(es.application.home.contact.title);
    expect(h2.textContent?.replace(/\s+/g, ' ').trim()).toBe(es.application.home.contact.title);
  });

  it('links to /contacto and leaves the e-mail to the footer below', () => {
    const el = create();
    expect(el.querySelector('a[href="/contacto"]')?.textContent).toContain(es.application.home.contact.cta);
    expect(el.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('renders fully visible on the server', () => {
    const el = create('server');
    expect(el.querySelector('[style]')).toBeNull();
  });
});
