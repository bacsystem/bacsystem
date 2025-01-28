import {Routes} from '@angular/router';


export default [
  {
    path: '',
    loadComponent: () => import('./console.component'),

    children: [

    ]

  }
] as Routes;
