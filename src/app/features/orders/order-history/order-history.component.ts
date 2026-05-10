import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <h2 class="fw-bold mb-4"><i class="bi bi-bag me-2"></i>Mes Commandes</h2>

      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Chargement...</p>
      </div>

      <div class="text-center py-5" *ngIf="!loading && orders.length === 0">
        <i class="bi bi-bag-x display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">Aucune commande</h4>
        <a routerLink="/catalog" class="btn btn-primary mt-3">Commencer à acheter</a>
      </div>

      <div *ngIf="!loading && orders.length > 0">
        <div class="card border-0 shadow-sm mb-3" *ngFor="let order of orders">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-bold">Commande #{{ order.id }}</span>
            <div>
              <span class="badge me-2 bg-warning text-dark" *ngIf="order.status === 'PENDING'">En attente</span>
              <span class="badge me-2 bg-success" *ngIf="order.status === 'CONFIRMED'">Confirmée</span>
              <span class="badge me-2 bg-info" *ngIf="order.status === 'DELIVERED'">Livrée</span>
              <small class="text-muted">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-1" *ngFor="let item of order.items">
              <div class="col-6 fw-semibold">{{ item.productTitle }}</div>
              <div class="col-3 text-muted">x{{ item.quantity }}</div>
              <div class="col-3 text-end text-primary fw-semibold">{{ item.subtotal }} MAD</div>
            </div>
            <hr>
            <div class="d-flex justify-content-end">
              <strong class="text-primary fs-5">Total : {{ order.total }} MAD</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUser?.id;
    this.http.get<any[]>(`http://localhost:8080/api/orders/user/${userId}`).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur commandes', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}