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

  it('links the email with mailto', () => {
    const a = el.querySelector('a[href^="mailto:"]');
    expect(a?.getAttribute('href')).toBe('mailto:bacsystem.sac@gmail.com');
    expect(a?.textContent).toContain(SITE.email);
  });

  it('links the phone with tel and no spaces', () => {
    const a = el.querySelector('a[href^="tel:"]');
    expect(a?.getAttribute('href')).toBe('tel:+51907892868');
    expect(a?.textContent).toContain(SITE.phone);
  });

  it('shows the address as plain text, not a link', () => {
    expect(el.textContent).toContain(SITE.address);
    expect(el.querySelectorAll('a').length).toBe(2);
  });

  it('has no form', () => {
    expect(el.querySelector('form')).toBeNull();
  });
});
