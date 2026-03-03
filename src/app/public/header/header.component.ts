import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuService, MenuItem } from '../../core/menu.service';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  titles: MenuItem[] = [];
  currentLanguage: string = 'EN';
  mobileNavOpen = false;
  activeDropdownId: number | null = null;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly languageService: LanguageService,
    private readonly menuService: MenuService,
  ) {}

  useLanguage(language: string): void {
    this.languageService.useLanguage(language);
    this.updateLanguages();
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage === 'ES' ? 'en' : 'es';
    this.useLanguage(newLang);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    this.document.body.classList.toggle(
      'mobile-nav-active',
      this.mobileNavOpen,
    );
  }

  closeMobileNav(): void {
    this.mobileNavOpen = false;
    this.activeDropdownId = null;
    this.document.body.classList.remove('mobile-nav-active');
  }

  toggleDropdown(id: number): void {
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
  }

  updateLanguages(): void {
    const lang = this.languageService.getCurrentLang();
    this.currentLanguage = lang === 'es' ? 'ES' : 'EN';
  }

  ngOnInit(): void {
    this.titles = this.menuService.getMenuItems();
    this.updateLanguages();
  }
}
