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

  it('shows WhatsApp and the phone as links, and no e-mail', () => {
    const wa = el.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]');
    const tel = el.querySelector<HTMLAnchorElement>('a[href^="tel:"]');
    expect(wa?.getAttribute('href')).toBe('https://wa.me/51972107074');
    expect(wa?.rel).toBe('noopener');
    expect(tel?.getAttribute('href')).toBe('tel:+51972107074');
    expect(tel?.textContent).toContain('+51 972 107 074');
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
