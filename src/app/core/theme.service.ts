import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mode: ThemeMode = 'system';
  private mediaQuery?: MediaQueryList;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('theme-mode') as ThemeMode | null;
    this.applyMode(saved ?? 'system');
  }

  get currentMode(): ThemeMode {
    return this.mode;
  }

  get isDark(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /** Icon for the current mode */
  get icon(): string {
    return { light: 'bi-sun-fill', dark: 'bi-moon-fill', system: 'bi-circle-half' }[this.mode];
  }

  /** Cycle: light → dark → system → light */
  cycle(): void {
    const next: ThemeMode = this.mode === 'light' ? 'dark' : this.mode === 'dark' ? 'system' : 'light';
    this.applyMode(next);
  }

  private applyMode(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.mode = mode;
    localStorage.setItem('theme-mode', mode);

    // Remove existing listener
    this.mediaQuery?.removeEventListener('change', this.onSystemChange);

    if (mode === 'system') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.onSystemChange);
      this.setTheme(this.mediaQuery.matches ? 'dark' : 'light');
    } else {
      this.setTheme(mode);
    }
  }

  private readonly onSystemChange = (e: MediaQueryListEvent): void => {
    this.setTheme(e.matches ? 'dark' : 'light');
  };

  private setTheme(resolved: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', resolved);
    document.body.classList.toggle('dark-mode', resolved === 'dark');
  }
}
