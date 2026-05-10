import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

export const routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' as const },
  { path: 'auth', loadChildren: () => import('./app/features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'catalog', loadChildren: () => import('./app/features/catalog/catalog.module').then(m => m.CatalogModule) },
  { path: 'cart', loadChildren: () => import('./app/features/cart/cart.module').then(m => m.CartModule) },
  { path: 'orders', loadChildren: () => import('./app/features/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'profile', loadChildren: () => import('./app/features/profile/profile.module').then(m => m.ProfileModule) },
  { path: '**', redirectTo: '/catalog' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    importProvidersFrom(FormsModule)
  ]
}).catch(err => console.error(err));