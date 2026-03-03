import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public/home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./public/public.routes').then((value) => value.default),
  },
];
