import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Bootstrap Icons name (without the `bi-` prefix) for each mode. */
export type ThemeIcon = 'sun-fill' | 'moon-fill' | 'circle-half';

const STORAGE_KEY = 'theme-mode';
const DEFAULT_MODE: ThemeMode = 'light';
const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
const ICONS: Record<ThemeMode, ThemeIcon> = {
  light: 'sun-fill',
  dark: 'moon-fill',
  system: 'circle-half',
};

/**
 * Sets `data-theme` on <html>; the colours themselves live in
 * src/styles/tokens.css (`:root` = light, `[data-theme='dark']` = dark).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mode: ThemeMode = DEFAULT_MODE;
  private mediaQuery?: MediaQueryList;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.applyMode(this.readSaved());
  }

  get currentMode(): ThemeMode {
    return this.mode;
  }

  get isDark(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return document.documentElement.dataset['theme'] === 'dark';
  }

  get icon(): ThemeIcon {
    return ICONS[this.mode];
  }

  /** Cycle: light → dark → system → light */
  cycle(): void {
    const next = MODES[(MODES.indexOf(this.mode) + 1) % MODES.length];
    this.applyMode(next);
  }

  private readSaved(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return MODES.includes(saved as ThemeMode) ? (saved as ThemeMode) : DEFAULT_MODE;
    } catch {
      return DEFAULT_MODE;
    }
  }

  private applyMode(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.mode = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage unavailable (private mode, quota): theme still applies for this visit.
    }

    this.mediaQuery?.removeEventListener('change', this.onSystemChange);
    this.mediaQuery = undefined;

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
    document.documentElement.dataset['theme'] = resolved;
  }
}
