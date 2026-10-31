import { Routes } from '@angular/router';
import { SeoRouteData } from './core/seo.service';

const soon = (key: string): { seo: SeoRouteData } => ({
  seo: { titleKey: `application.site.seo.${key}.title`, descriptionKey: `application.site.seo.${key}.description`, indexable: false },
});
const comingSoon = () => import('./pages/coming-soon/coming-soon.page').then(m => m.ComingSoonPageComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/site-layout.component').then(m => m.SiteLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePageComponent),
        data: { seo: { titleKey: 'application.site.seo.home.title', descriptionKey: 'application.site.seo.home.description' } },
      },
      {
        path: 'contacto',
        loadComponent: () => import('./pages/contact/contact.page').then(m => m.ContactPageComponent),
        data: { seo: { titleKey: 'application.site.seo.contact.title', descriptionKey: 'application.site.seo.contact.description' } },
      },
      { path: 'servicios', loadComponent: comingSoon, data: soon('services') },
      { path: 'productos', loadComponent: comingSoon, data: soon('products') },
      { path: 'productos/operaai', loadComponent: comingSoon, data: soon('operaai') },
      { path: 'productos/sophia', loadComponent: comingSoon, data: soon('sophia') },
      { path: 'nosotros', loadComponent: comingSoon, data: soon('about') },
      // `guia-ui` (dev only) is added in Task 6.
      { path: '**', redirectTo: '' },
    ],
  },
];
