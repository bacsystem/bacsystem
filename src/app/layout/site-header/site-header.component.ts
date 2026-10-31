import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
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

  constructor() {
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
