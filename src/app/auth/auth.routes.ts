import { Routes } from '@angular/router';


export default [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'signup',
        loadComponent: () => import('./login/login.component')
    },
] as Routes;