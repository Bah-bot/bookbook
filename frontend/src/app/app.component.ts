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
    <nav class="navbar navbar-expand-lg sticky-top"
         [class.navbar-dark]="isDark"
         [class.navbar-light]="!isDark"
         [class.bg-dark]="isDark"
         [class.bg-white]="!isDark"
         [style.border-bottom]="!isDark ? '1px solid #e0e0e0' : 'none'">
      <div class="container">
        <a class="navbar-brand" routerLink="/catalog" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <svg width="48" height="36" viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="42" width="120" height="12" fill="#c9a84c"/>
            <rect x="0" y="42" width="8" height="12" fill="#8a6f2e"/>
            <rect x="0" y="27" width="104" height="12" fill="#e8c97a"/>
            <rect x="0" y="27" width="8" height="12" fill="#c9a84c"/>
            <rect x="0" y="12" width="88" height="12" fill="#c9a84c"/>
            <rect x="0" y="12" width="8" height="12" fill="#8a6f2e"/>
            <polyline points="130,12 130,54 120,54" fill="none" stroke="#c9a84c" stroke-width="4" stroke-linecap="square"/>
          </svg>
          <span style="font-family:'Arial Black',sans-serif;font-weight:900;font-size:1.2rem;letter-spacing:-0.5px;">
            <span style="color:#c9a84c;">BOOK</span><span [style.color]="isDark ? '#f0ead6' : '#111114'">CORNER</span>
          </span>
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
            <li class="nav-item" *ngIf="isAdmin">
              <a class="nav-link fw-semibold" routerLink="/admin" routerLinkActive="active"
                 style="color:#c9a84c!important;">
                <i class="bi bi-shield-lock-fill me-1"></i>Admin
              </a>
            </li>
          </ul>
          <ul class="navbar-nav align-items-center">
            <!-- DARK MODE TOGGLE -->
            <li class="nav-item me-2">
              <button class="btn btn-sm d-flex align-items-center gap-2"
                      (click)="toggleDark()"
                      [class.btn-outline-light]="isDark"
                      [class.btn-outline-secondary]="!isDark"
                      style="border-radius:20px;padding:4px 12px;font-size:0.82rem;">
                <i [class]="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
                {{ isDark ? 'Light' : 'Dark' }}
              </button>
            </li>
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
                <li *ngIf="isAdmin"><hr class="dropdown-divider"></li>
                <li *ngIf="isAdmin">
                  <a class="dropdown-item fw-semibold" routerLink="/admin" style="color:#c9a84c;">
                    <i class="bi bi-shield-lock-fill me-2"></i>Administration
                  </a>
                </li>
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

    <main [class.bg-light]="!isDark" [class.bg-dark]="isDark" class="min-vh-100">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-dark text-white text-center py-3 mt-auto">
      <p class="mb-0">© 2026 BookCorner</p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  cartCount = 0;
  isDark = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('darkMode');
    this.isDark = saved === 'true';
    this.applyDark(this.isDark);

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) this.cartService.getCart().subscribe();
    });
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.itemCount || 0;
    });
  }

  toggleDark(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', String(this.isDark));
    this.applyDark(this.isDark);
  }

  applyDark(dark: boolean): void {
    document.body.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    document.body.style.backgroundColor = dark ? '#212529' : '';
    document.body.style.color = dark ? '#f8f9fa' : '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/catalog']);
  }
}