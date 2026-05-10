import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/catalog">
          <i class="bi bi-book-half me-2"></i>BookCorner
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/catalog" routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: false}">
                <i class="bi bi-grid me-1"></i>Catalogue
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="currentUser">
              <a class="nav-link position-relative" routerLink="/cart">
                <i class="bi bi-cart3 fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      *ngIf="cartCount > 0">{{ cartCount }}</span>
              </a>
            </li>
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>{{ currentUser.email }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" routerLink="/profile"><i class="bi bi-person me-2"></i>Mon Profil</a></li>
                <li><a class="dropdown-item" routerLink="/orders"><i class="bi bi-bag me-2"></i>Mes Commandes</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
              </ul>
            </li>
            <li class="nav-item" *ngIf="!currentUser">
              <a class="nav-link" routerLink="/auth/login"><i class="bi bi-box-arrow-in-right me-1"></i>Connexion</a>
            </li>
            <li class="nav-item" *ngIf="!currentUser">
              <a class="btn btn-primary btn-sm ms-2 mt-1" routerLink="/auth/register">Inscription</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="min-vh-100 bg-light">
      <router-outlet></router-outlet>
    </main>
    <footer class="bg-dark text-white text-center py-3 mt-auto">
      <p class="mb-0">© 2024 BookCorner</p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) this.cartService.getCart().subscribe();
    });
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.itemCount || 0;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }
}