import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SiteFooterComponent } from './site-footer/site-footer.component';
import { SiteHeaderComponent } from './site-header/site-header.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, SiteHeaderComponent, SiteFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#contenido" (click)="skipToContent($event)">{{ 'application.site.nav.skip' | translate }}</a>
    <app-site-header />
    <main #main id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styleUrl: './site-layout.component.css',
})
export class SiteLayoutComponent {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    const document = inject(DOCUMENT);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    // The router scrolls to #fragments with window.scrollTo, which ignores CSS scroll-padding and
    // scroll-margin: offset it by the html scroll-padding-top (--header-height, the sticky header).
    inject(ViewportScroller).setOffset(() => {
      const html = document.documentElement;
      return [0, parseFloat(document.defaultView?.getComputedStyle(html).scrollPaddingTop ?? '') || 0];
    });
  }

  /** With <base href="/">, a bare #fragment would resolve against the root; focus <main> instead. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
