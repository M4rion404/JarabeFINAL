import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'accounts',
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
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

export class AppRoutes {}

