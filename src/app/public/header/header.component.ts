import { Component, Inject, OnInit, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, NgClass } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuService, MenuItem } from '../../core/menu.service';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, TranslatePipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  titles: MenuItem[] = [];
  currentLanguage: string = 'EN';
  mobileNavOpen = false;
  activeDropdownId: number | null = null;
  private routerSub?: Subscription;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly languageService: LanguageService,
    private readonly menuService: MenuService,
    private readonly router: Router,
    public readonly theme: ThemeService,
  ) {}

  useLanguage(language: string): void {
    this.languageService.useLanguage(language);
    this.updateLanguages();
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ES' ? 'en' : 'es';
    this.useLanguage(newLang);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    this.document.body.classList.toggle(
      'mobile-nav-active',
      this.mobileNavOpen,
    );
  }

  closeMobileNav(): void {
    this.mobileNavOpen = false;
    this.activeDropdownId = null;
    this.document.body.classList.remove('mobile-nav-active');
  }

  toggleDropdown(id: number): void {
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  updateLanguages(): void {
    const lang = this.languageService.getCurrentLang();
    this.currentLanguage = lang === 'es' ? 'ES' : 'EN';
  }

  ngOnInit(): void {
    this.theme.init();
    this.titles = this.menuService.getMenuItems();
    this.updateLanguages();
    this.updateScrolledState();

    // Re-evaluate on every route navigation
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updateScrolledState();
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  /** Apply .scrolled when not on home (no dark hero) or scrolled past 50px */
  private updateScrolledState(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const onHome = this.router.url === '/public/home';
    if (!onHome || window.scrollY > 50) {
      this.document.body.classList.add('scrolled');
    } else {
      this.document.body.classList.remove('scrolled');
    }
  }

  navClick(item: MenuItem): void {
    this.navToSection(item.routerLink.split('/').pop() ?? 'home');
  }

  navToSection(sectionId: string): void {
    const onHome = this.router.url.startsWith('/public/home');
    if (onHome && isPlatformBrowser(this.platformId)) {
      document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/public/home']).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      });
    }
    this.closeMobileNav();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrolledState();
  }
}
