import { Routes } from '@angular/router';
import { DEV_ROUTES } from './dev-routes';

const notFound = () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPageComponent);
const notFoundSeo = { titleKey: 'application.site.seo.notFound.title', descriptionKey: 'application.site.seo.notFound.description', indexable: false };

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
      {
        path: 'productos',
        loadComponent: () => import('./pages/products/products.page').then(m => m.ProductsPageComponent),
        data: { seo: { titleKey: 'application.site.seo.products.title', descriptionKey: 'application.site.seo.products.description', indexable: true } },
      },
      {
        path: 'productos/khipu',
        loadComponent: () => import('./pages/khipu/khipu.page').then(m => m.KhipuPageComponent),
        data: { seo: { titleKey: 'application.site.seo.khipu.title', descriptionKey: 'application.site.seo.khipu.description', indexable: true } },
      },
      {
        path: 'productos/wanka',
        loadComponent: () => import('./pages/wanka/wanka.page').then(m => m.WankaPageComponent),
        data: { seo: { titleKey: 'application.site.seo.wanka.title', descriptionKey: 'application.site.seo.wanka.description', indexable: true } },
      },
      ...DEV_ROUTES,
      // Prerendered as 404.html (scripts/copy-404.mjs); '**' shows the same page for any unknown URL in the app.
      { path: '404', loadComponent: notFound, data: { seo: notFoundSeo } },
      { path: '**', loadComponent: notFound, data: { seo: notFoundSeo } },
    ],
  },
];
