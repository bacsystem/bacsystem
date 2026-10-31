import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
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
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-block-size: 100vh;
    }

    main {
      flex: 1;
    }

    main:focus {
      outline: none;
    }

    .skip-link {
      position: absolute;
      inset-block-start: var(--space-2);
      inset-inline-start: var(--space-2);
      z-index: var(--z-overlay);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-pill);
      background-color: var(--color-primary);
      color: var(--color-on-primary);
      transform: translateY(calc(-100% - var(--space-4)));
    }

    .skip-link:focus {
      transform: none;
    }
  `,
})
export class SiteLayoutComponent {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /** With <base href="/">, a bare #fragment would resolve against the root; focus <main> instead. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
