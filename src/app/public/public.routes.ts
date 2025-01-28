import {Routes} from '@angular/router';

export default [
  {
    path: 'public',
    loadComponent: () => import ('./public.component').then(value => {
      console.log("PublicComponent", value.PublicComponent);
      return value.PublicComponent
    }),

    children: [

      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(value => {
          console.log(value)
          return value.HomeComponent;
        }),
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(value => {
          console.log(value)
          return value.AboutComponent;
        }),
      },
      {
        path: 'services',
        loadComponent: () => import('./services/services.component').then(value => {
          console.log(value)
          return value.ServicesComponent;
        })
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./portfolio/portfolio.component').then(value => {
          console.log(value)
          return value.PortfolioComponent;
        })
      },
      {
        path: 'team',
        loadComponent: () => import('./team/team.component').then(value => {
          console.log(value)
          return value.TeamComponent;
        })
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(value => {
          console.log(value)
          return value.ContactComponent;
        })
      },
      {
        path: '',
        redirectTo: 'public',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full',
  }
] as Routes;
