import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MenuService, MenuItem} from '../../core/menu.service';
import {LanguageService} from '../../core/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  titles: MenuItem[] = []
  currentLanguage: string = 'ES';
  otherLanguage: string = 'EN';

  constructor(private languageService: LanguageService, private menuService: MenuService) {}

  useLanguage(language: string): void {
    this.languageService.useLanguage(language);
    this.updateLanguages();
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ES' ? 'en' : 'es';
    this.useLanguage(newLang);
  }

  updateLanguages(): void {
    const lang = this.languageService.getCurrentLang();
    this.currentLanguage = lang === 'es' ? 'ES' : 'EN';
    this.otherLanguage = this.currentLanguage === 'ES' ? 'EN' : 'ES';
  }

  ngOnInit(): void {
    this.titles = this.menuService.getMenuItems();
    this.updateLanguages();
  }
}
