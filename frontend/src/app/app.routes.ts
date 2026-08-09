import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { LeadList } from './features/leads/lead-list/lead-list';
import { GetQuote } from './features/get-quote/get-quote';
import { authGuard, adminGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'get-quote',
    component: GetQuote
  },
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    redirectTo: 'leads',
    pathMatch: 'full'
  },
  {
    path: 'leads',
    component: LeadList,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
