import { Routes } from '@angular/router';

export default [
  {
    path: 'public',
    loadComponent: () =>
      import('./public.component').then((value) => {
        return value.PublicComponent;
      }),

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then((value) => {
            return value.HomeComponent;
          }),
      },
      { path: 'about',    redirectTo: 'home', pathMatch: 'full' },
      { path: 'services', redirectTo: 'home', pathMatch: 'full' },
      { path: 'products', redirectTo: 'home', pathMatch: 'full' },
      { path: 'team',     redirectTo: 'home', pathMatch: 'full' },
      { path: 'contact',  redirectTo: 'home', pathMatch: 'full' },
      { path: '',         redirectTo: 'home', pathMatch: 'full' },
    ],
  },
] as Routes;
