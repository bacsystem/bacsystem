import { Injectable } from '@angular/core';

export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  routerLink: string;
  routerLinkActive: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  getMenuItems(): MenuItem[] {
    return [
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
        active: true
      },
      {
        id: 4,
        icon: "",
        title: "application.menu.portfolio",
        routerLink: "portfolio",
        routerLinkActive: "active",
        active: true
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
        active: true
      }
    ];
  }
}