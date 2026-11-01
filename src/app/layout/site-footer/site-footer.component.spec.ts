import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NAV_LINKS } from '../nav-links';
import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SiteFooterComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('shows the number once, opening WhatsApp, and no e-mail', () => {
    const wa = el.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]');
    expect(wa?.getAttribute('href')).toContain('https://wa.me/51972107074?text=');
    expect(wa?.rel).toBe('noopener');
    expect(wa?.textContent).toContain('+51 972 107 074');
    expect(el.querySelector('.site-footer__contact')?.textContent?.split('+51 972 107 074').length).toBe(2);
    expect(el.querySelector('a[href^="tel:"]')).toBeNull();
    expect(el.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('renders one link per NAV_LINKS entry', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.site-footer__nav a'));
    expect(links.map(a => a.getAttribute('href'))).toEqual(NAV_LINKS.map(l => l.path));
  });

  it('shows the current year', () => {
    expect(el.textContent).toContain(String(new Date().getFullYear()));
  });
});
