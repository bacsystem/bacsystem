import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'lang';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly supported = ['es', 'en'] as const;
  private readonly isBrowser: boolean;

  constructor(
    private readonly translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.translate.addLangs([...this.supported]);
    this.translate.setDefaultLang('es');
  }

  async init(): Promise<void> {
    const lang = this.readStored() ?? 'es';
    this.document.documentElement.lang = lang;
    try {
      await firstValueFrom(this.translate.use(lang));
    } catch {
      // Do not block app bootstrap if translations fail to load.
    }
  }

  useLanguage(language: string): void {
    if (!this.isSupported(language)) {
      return;
    }
    this.translate.use(language);
    this.document.documentElement.lang = language;
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, language);
      } catch {
        // Storage unavailable; ignore.
      }
    }
  }

  getCurrentLang(): Lang {
    const current = this.translate.currentLang;
    return this.isSupported(current) ? current : 'es';
  }

  private readStored(): Lang | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value !== null && this.isSupported(value) ? value : null;
    } catch {
      return null;
    }
  }

  private isSupported(value: string | undefined | null): value is Lang {
    return (this.supported as readonly string[]).includes(value ?? '');
  }
}
