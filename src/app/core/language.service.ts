import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.translate.addLangs(['en', 'es']);
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}