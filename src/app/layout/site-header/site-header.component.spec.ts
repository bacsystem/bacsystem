import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { NAV_LINKS } from '../nav-links';
import { SiteHeaderComponent } from './site-header.component';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('SiteHeaderComponent', () => {
  let fixture: ComponentFixture<SiteHeaderComponent>;
  let el: HTMLElement;
  let language: jasmine.SpyObj<LanguageService>;

  const toggle = () => el.querySelector<HTMLButtonElement>('.site-header__toggle')!;

  beforeEach(() => {
    language = jasmine.createSpyObj<LanguageService>('LanguageService', ['useLanguage', 'getCurrentLang']);
    language.getCurrentLang.and.returnValue('es');
    const theme = jasmine.createSpyObj<ThemeService>('ThemeService', ['init', 'cycle'], {
      icon: 'sun-fill',
      currentMode: 'light',
      isDark: false,
    });

    TestBed.configureTestingModule({
      imports: [SiteHeaderComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: '**', component: DummyComponent }]),
        { provide: LanguageService, useValue: language },
        { provide: ThemeService, useValue: theme },
      ],
    });
    fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders one link per NAV_LINKS entry with the right href', () => {
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.site-nav__link'));
    expect(links.length).toBe(NAV_LINKS.length);
    links.forEach((a, i) => expect(a.getAttribute('href')).toBe(NAV_LINKS[i].path));
  });

  it('menu button toggles aria-expanded between false and true', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    toggle().click();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('makes the page behind the open menu inert and focuses the first menu link', fakeAsync(() => {
    const main = document.createElement('main');
    document.body.append(main, el);
    toggle().click();
    fixture.detectChanges();
    tick();
    expect(main.hasAttribute('inert')).toBeTrue();
    expect(document.activeElement).toBe(el.querySelector('.site-nav__link'));
    toggle().click();
    fixture.detectChanges();
    expect(main.hasAttribute('inert')).toBeFalse();
    main.remove();
    el.remove();
  }));

  it('Escape closes the open menu', () => {
    toggle().click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('navigating closes the open menu', fakeAsync(() => {
    toggle().click();
    fixture.detectChanges();
    TestBed.inject(Router).navigateByUrl('/servicios');
    tick();
    fixture.detectChanges();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  }));

  it('language button switches to en when current is es', () => {
    el.querySelector<HTMLButtonElement>('.site-header__lang')!.click();
    expect(language.useLanguage).toHaveBeenCalledWith('en');
  });
});
