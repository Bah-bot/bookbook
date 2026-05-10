import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <h2 class="fw-bold mb-4"><i class="bi bi-cart3 me-2"></i>Mon Panier</h2>

      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Chargement du panier...</p>
      </div>

      <div *ngIf="!loading">
        <div class="text-center py-5" *ngIf="!cart || cart.items.length === 0">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h4 class="mt-3 text-muted">Votre panier est vide</h4>
          <a routerLink="/catalog" class="btn btn-primary mt-3">Parcourir le catalogue</a>
        </div>

        <div class="row" *ngIf="cart && cart.items.length > 0">
          <div class="col-md-8">
            <div class="card border-0 shadow-sm mb-3" *ngFor="let item of cart.items">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img [src]="item.productImageUrl || 'https://via.placeholder.com/80x100?text=Book'"
                         class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                  </div>
                  <div class="col-md-4">
                    <h6 class="fw-bold mb-1">{{ item.productTitle }}</h6>
                    <small class="text-muted">{{ item.unitPrice }} MAD / unité</small>
                  </div>
                  <div class="col-md-3">
                    <div class="input-group input-group-sm">
                      <button class="btn btn-outline-secondary"
                              (click)="updateQuantity(item.id, item.quantity - 1)"
                              [disabled]="item.quantity <= 1">-</button>
                      <span class="input-group-text">{{ item.quantity }}</span>
                      <button class="btn btn-outline-secondary"
                              (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
                    </div>
                  </div>
                  <div class="col-md-2 text-end">
                    <strong class="text-primary">{{ item.subtotal }} MAD</strong>
                  </div>
                  <div class="col-md-1 text-end">
                    <button class="btn btn-sm btn-outline-danger" (click)="removeItem(item.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-primary text-white fw-semibold">Récapitulatif</div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2" *ngFor="let item of cart.items">
                  <small>{{ item.productTitle }} x{{ item.quantity }}</small>
                  <small>{{ item.subtotal }} MAD</small>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span class="text-primary">{{ cart.total }} MAD</span>
                </div>

                <div class="alert alert-success mt-3" *ngIf="orderSuccess">
                  <i class="bi bi-check-circle me-2"></i>Commande validée ! Redirection...
                </div>
                <div class="alert alert-danger mt-3" *ngIf="orderError">{{ orderError }}</div>

                <button class="btn btn-success w-100 mt-3 py-2 fw-semibold"
                        (click)="checkout()" [disabled]="checkingOut">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="checkingOut"></span>
                  <i class="bi bi-bag-check me-2" *ngIf="!checkingOut"></i>
                  Valider la commande
                </button>
                <a routerLink="/catalog" class="btn btn-outline-secondary w-100 mt-2">
                  Continuer mes achats
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading = true;
  checkingOut = false;
  orderSuccess = false;
  orderError = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = this.authService.currentUser?.id;
    this.loading = true;
    this.http.get<any>(`http://localhost:8080/api/cart/user/${userId}`).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur panier', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    const userId = this.authService.currentUser?.id;
    this.http.put<any>(`http://localhost:8080/api/cart/user/${userId}/items/${itemId}`, { quantity }).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(itemId: number): void {
    const userId = this.authService.currentUser?.id;
    this.http.delete<any>(`http://localhost:8080/api/cart/user/${userId}/items/${itemId}`).subscribe({
      next: (res) => {
        this.cart = res.data;
        this.cdr.detectChanges();
      }
    });
  }

  checkout(): void {
    this.checkingOut = true;
    this.orderError = '';
    this.orderService.checkout().subscribe({
      next: () => {
        this.checkingOut = false;
        this.orderSuccess = true;
        this.cart = null;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/orders']), 2000);
      },
      error: (err: any) => {
        this.checkingOut = false;
        this.orderError = err.error || 'Erreur lors de la commande';
        this.cdr.detectChanges();
      }
    });
  }
}