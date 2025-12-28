import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { authGuard } from '../auth/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
