import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { ButtonComponent, IconComponent } from '../../shared/ui';
import { NAV_LINKS } from '../nav-links';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, ButtonComponent, IconComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent implements OnInit {
  protected readonly links = NAV_LINKS;
  protected readonly menuOpen = signal(false);
  protected readonly theme = inject(ThemeService);
  private readonly language = inject(LanguageService);
  private readonly toggleButton = viewChild<ElementRef<HTMLButtonElement>>('toggle');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);

  constructor() {
    // Open menu = the only thing on screen: the page behind it goes inert (no focus, no screen reader)
    // and focus moves to the first link, so Tab walks the menu instead of the hidden page.
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      effect(() => {
        const open = this.menuOpen();
        this.document.querySelectorAll<HTMLElement>('main, app-site-footer').forEach(el => el.toggleAttribute('inert', open));
        if (open) setTimeout(() => this.host.querySelector<HTMLElement>('.site-nav__link')?.focus());
      });
      // Growing past the menu breakpoint (desktop nav) closes it, so the page never stays inert.
      const desktop = this.document.defaultView?.matchMedia?.('(min-width: 64em)');
      const close = (e: MediaQueryListEvent) => e.matches && this.menuOpen.set(false);
      desktop?.addEventListener('change', close);
      inject(DestroyRef).onDestroy(() => desktop?.removeEventListener('change', close));
    }

    inject(Router)
      .events.pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  ngOnInit(): void {
    this.theme.init();
  }

  /** Language the button switches to (the one not currently active). */
  protected get nextLang(): 'es' | 'en' {
    return this.language.getCurrentLang() === 'es' ? 'en' : 'es';
  }

  protected toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  /** Any menu link closes it, also the one for the page already open (no navigation event then). */
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** A tap outside the header closes the open menu. */
  @HostListener('document:click', ['$event.target'])
  protected onDocumentClick(target: EventTarget | null): void {
    if (this.menuOpen() && target instanceof Node && !this.host.contains(target)) this.menuOpen.set(false);
  }

  protected switchLanguage(): void {
    this.language.useLanguage(this.nextLang);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.toggleButton()?.nativeElement.focus();
  }
}
