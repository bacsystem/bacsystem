import { isDevMode } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { SeoRouteData } from './core/seo.service';

const soon = (key: string): { seo: SeoRouteData; headingKey: string } => ({
  seo: { titleKey: `application.site.seo.${key}.title`, descriptionKey: `application.site.seo.${key}.description`, indexable: false },
  headingKey: `application.site.comingSoon.headings.${key}`,
});
// Internal UI reference: only registered in development builds.
const devOnly: Route[] = isDevMode()
  ? [
      {
        path: 'guia-ui',
        loadComponent: () => import('./pages/ui-guide/ui-guide.page').then(m => m.UiGuidePageComponent),
        data: { seo: { titleKey: 'application.site.seo.uiGuide.title', descriptionKey: 'application.site.seo.uiGuide.description', indexable: false } },
      },
    ]
  : [];

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
      {
        path: 'nosotros',
        loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPageComponent),
        data: { seo: { titleKey: 'application.site.seo.about.title', descriptionKey: 'application.site.seo.about.description', indexable: true } },
      },
      {
        path: 'servicios',
        loadComponent: () => import('./pages/services/services.page').then(m => m.ServicesPageComponent),
        data: { seo: { titleKey: 'application.site.seo.services.title', descriptionKey: 'application.site.seo.services.description', indexable: true } },
      },
      { path: 'productos', loadComponent: comingSoon, data: soon('products') },
      { path: 'productos/operaai', loadComponent: comingSoon, data: soon('operaai') },
      { path: 'productos/sophia', loadComponent: comingSoon, data: soon('sophia') },
      ...devOnly,
      { path: '**', redirectTo: '' },
    ],
  },
];
