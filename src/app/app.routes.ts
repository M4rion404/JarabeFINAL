import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => 
      import('./auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.routes').then(
        m => m.TRANSACTIONS_ROUTES
      ),
  },
  {
  path: 'dashboard',
  loadChildren: () =>
    import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

export class AppRoutes {}

