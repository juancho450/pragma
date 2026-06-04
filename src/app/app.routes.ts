import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.page').then(m => m.CategoriesPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
