import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import { SITE } from '../../data/site.data';
import { ContactPageComponent } from './contact.page';

describe('ContactPageComponent', () => {
  let fixture: ComponentFixture<ContactPageComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactPageComponent, TranslateModule.forRoot()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('renders exactly one h1', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(es.application.site.contactPage.title);
  });

  it('shows the number once (phone and WhatsApp share it) and no e-mail', () => {
    expect(el.querySelector('.contact__list')?.textContent?.split(SITE.phone).length).toBe(2);
    expect(el.querySelector('.contact__list a[href^="https://wa.me/"]')).toBeNull();
    expect(el.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('links the phone with tel and no spaces', () => {
    const a = el.querySelector('a[href^="tel:"]');
    expect(a?.getAttribute('href')).toBe('tel:+51972107074');
    expect(a?.textContent).toContain(SITE.phone);
  });

  it('shows the address as plain text, not a link', () => {
    expect(el.textContent).toContain(SITE.address);
    expect(el.querySelectorAll('.contact__list a').length).toBe(1);
  });

  it('leads with a WhatsApp button whose chat opens with the default message, and has no form', () => {
    const cta = el.querySelector<HTMLAnchorElement>('.contact__cta a[ui-button]');
    expect(cta?.textContent).toContain(es.application.site.contactPage.whatsappCta);
    const url = new URL(cta!.href);
    expect(url.origin + url.pathname).toBe('https://wa.me/51972107074');
    expect(url.searchParams.get('text')).toBe(es.application.site.contactPage.whatsappMessage);
    expect(cta?.target).toBe('_blank');
    expect(el.querySelector('form')).toBeNull();
  });
});
