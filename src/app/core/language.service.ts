import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private readonly translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.addLangs(['en', 'es']);
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}