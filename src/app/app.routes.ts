import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard, restaurantGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'r/:slug',
    loadComponent: () => import('./features/preview/menu-preview.component').then(m => m.MenuPreviewComponent)
  },
  {
    path: 'preview/:id',
    loadComponent: () => import('./features/preview/menu-preview.component').then(m => m.MenuPreviewComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin-home.component').then(m => m.AdminHomeComponent)
      },
      {
        path: 'restaurants',
        loadComponent: () => import('./features/admin/restaurants-list.component').then(m => m.RestaurantsListComponent)
      },
      {
        path: 'restaurants/new',
        loadComponent: () => import('./features/admin/restaurant-form.component').then(m => m.RestaurantFormComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [restaurantGuard],
    loadComponent: () => import('./features/dashboard/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'menus',
        loadComponent: () => import('./features/menus/menus-list.component').then(m => m.MenusListComponent)
      },
      {
        path: 'menus/new',
        loadComponent: () => import('./features/menus/menu-form.component').then(m => m.MenuFormComponent)
      },
      {
        path: 'menus/:id',
        loadComponent: () => import('./features/menus/menu-form.component').then(m => m.MenuFormComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories-list.component').then(m => m.CategoriesListComponent)
      },
      {
        path: 'dishes',
        loadComponent: () => import('./features/dishes/dishes-list.component').then(m => m.DishesListComponent)
      },
      {
        path: 'preview',
        loadComponent: () => import('./features/dashboard/preview.component').then(m => m.PreviewComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
