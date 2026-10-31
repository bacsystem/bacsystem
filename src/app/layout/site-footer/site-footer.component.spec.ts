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

  it('shows contact email and phone as links', () => {
    const mail = el.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');
    const tel = el.querySelector<HTMLAnchorElement>('a[href^="tel:"]');
    expect(mail?.getAttribute('href')).toBe('mailto:bacsystem.sac@gmail.com');
    expect(mail?.textContent).toContain('bacsystem.sac@gmail.com');
    expect(tel?.getAttribute('href')).toBe('tel:+51907892868');
    expect(tel?.textContent).toContain('+51 907 892 868');
  });

  it('renders one link per NAV_LINKS entry', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.site-footer__nav a'));
    expect(links.map(a => a.getAttribute('href'))).toEqual(NAV_LINKS.map(l => l.path));
  });

  it('shows the current year', () => {
    expect(el.textContent).toContain(String(new Date().getFullYear()));
  });
});
