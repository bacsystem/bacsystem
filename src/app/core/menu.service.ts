import { Injectable } from '@angular/core';

export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  routerLink: string;
  routerLinkActive: string;
  active: boolean;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  getMenuItems(): MenuItem[] {
    return [
      {
        id: 1,
        icon: 'bi-house-fill',
        title: 'application.menu.home',
        routerLink: '/public/home',
        routerLinkActive: 'active',
        active: true,
      },
      {
        id: 2,
        icon: 'bi-person-fill',
        title: 'application.menu.about',
        routerLink: '/public/about',
        routerLinkActive: 'active',
        active: true,
      },
      {
        id: 3,
        icon: 'bi-grid-fill',
        title: 'application.menu.services',
        routerLink: '/public/services',
        routerLinkActive: 'active',
        active: true,
      },
      {
        id: 4,
        icon: 'bi-box-fill',
        title: 'application.menu.products',
        routerLink: '/public/products',
        routerLinkActive: 'active',
        active: true,
      },
      {
        id: 5,
        icon: 'bi-people-fill',
        title: 'application.menu.team',
        routerLink: '/public/team',
        routerLinkActive: 'active',
        active: true,
      },
      {
        id: 6,
        icon: 'bi-chat-dots-fill',
        title: 'application.menu.contact',
        routerLink: '/public/contact',
        routerLinkActive: 'active',
        active: true,
      },
    ];
  }
}
