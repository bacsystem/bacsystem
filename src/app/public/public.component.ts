import { Component, HostListener, Inject, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuService, MenuItem } from '../core/menu.service';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, TranslatePipe],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent implements OnInit, AfterViewInit, OnDestroy {
  showSectionsNav = false;
  navItems: MenuItem[] = [];
  activeSection = 'home';
  isLandingPage = false;

  private observer?: IntersectionObserver;
  private routerSub?: Subscription;

  readonly sectionIds = ['home', 'about', 'services', 'products', 'team', 'contact'];

  constructor(
    private readonly menuService: MenuService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    this.navItems = this.menuService.getMenuItems().filter(i => i.active);
    this.routerSub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.isLandingPage = (e.urlAfterRedirects ?? '').startsWith('/public/home');
      if (this.isLandingPage) {
        setTimeout(() => this.setupObserver(), 400);
      } else {
        this.teardownObserver();
        this.activeSection = (e.urlAfterRedirects ?? '').split('/').pop() ?? 'home';
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isLandingPage = this.router.url.startsWith('/public/home');
    if (this.isLandingPage) {
      setTimeout(() => this.setupObserver(), 400);
    } else {
      this.activeSection = this.router.url.split('/').pop() ?? 'home';
    }
  }

  ngOnDestroy(): void {
    this.teardownObserver();
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.showSectionsNav = window.scrollY > 280;
  }

  private setupObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.teardownObserver();
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            this.activeSection = e.target.id.replace('section-', '');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50% 0px' }
    );
    this.sectionIds.forEach(id => {
      const el = document.getElementById('section-' + id);
      if (el) this.observer!.observe(el);
    });
  }

  private teardownObserver(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  getSectionId(item: MenuItem): string {
    return item.routerLink.split('/').pop() ?? 'home';
  }

  navClick(item: MenuItem): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isLandingPage) {
      const el = document.getElementById('section-' + this.getSectionId(item));
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate([item.routerLink]);
    }
  }

  isNavActive(item: MenuItem): boolean {
    return this.activeSection === this.getSectionId(item);
  }
}
