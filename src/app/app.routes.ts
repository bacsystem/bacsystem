import { isDevMode } from '@angular/core';
import { Route, Routes } from '@angular/router';

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
      // khipu is the only product for now: /productos goes straight to it (public/_redirects does the same for direct hits).
      { path: 'productos', pathMatch: 'full', redirectTo: 'productos/khipu' },
      {
        path: 'productos/khipu',
        loadComponent: () => import('./pages/khipu/khipu.page').then(m => m.KhipuPageComponent),
        data: { seo: { titleKey: 'application.site.seo.khipu.title', descriptionKey: 'application.site.seo.khipu.description', indexable: true } },
      },
      ...devOnly,
      { path: '**', redirectTo: '' },
    ],
  },
];
