import {Routes} from '@angular/router';

export default [
  {
    path: 'public',
    loadComponent: () => import ('./public.component').then(value => {
      return value.PublicComponent
    }),

    children: [

      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(value => {
          return value.HomeComponent;
        }),
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(value => {
          return value.AboutComponent;
        }),
      },
      {
        path: 'services',
        loadComponent: () => import('./services/services.component').then(value => {
          return value.ServicesComponent;
        })
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./portfolio/portfolio.component').then(value => {
          return value.PortfolioComponent;
        })
      },
      {
        path: 'team',
        loadComponent: () => import('./team/team.component').then(value => {
          return value.TeamComponent;
        })
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(value => {
          return value.ContactComponent;
        })
      },
      {
        path: '',
        redirectTo: 'public/home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: 'public/home',
    pathMatch: 'full',
  }
] as Routes;
