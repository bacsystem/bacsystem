import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.addLangs(['en', 'es']);
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  ngOnInit(): void {
    this.titles = [
      {
        id: 1,
        icon: "",
        title: "application.menu.home",
        routerLink: "home",
        routerLinkActive: "active",
        active: true
      },
      {
        id: 2,
        icon: "",
        title: "application.menu.about",
        routerLink: "about",
        routerLinkActive: "active",
        active: true
      },
      {
        id: 3,
        icon: "",
        title: "application.menu.services",
        routerLink: "services",
        routerLinkActive: "active",
        active: false
      },
      {
        id: 4,
        icon: "",
        title: "application.menu.portfolio",
        routerLink: "portfolio",
        routerLinkActive: "active",
        active: false
      },
      {
        id: 5,
        icon: "",
        title: "application.menu.team",
        routerLink: "team",
        routerLinkActive: "active",
        active: false
      },
      {
        id: 6,
        icon: "",
        title: "application.menu.contact",
        routerLink: "contact",
        routerLinkActive: "active",
        active: false
      }

    ]
  }
}

interface MenuItem {
  id: number;
  title: string;
  icon: string;
  routerLink: string;
  routerLinkActive: string;
  active: boolean;
}
