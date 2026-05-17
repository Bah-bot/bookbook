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

        <!-- Orders list -->
        <div class="card border-0 shadow-sm mb-4" *ngFor="let order of orders">
          <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="d-flex align-items-center gap-3">
              <span class="fw-bold fs-6">Commande #{{ order.id }}</span>
              <!-- Tracking number -->
              <span class="badge bg-secondary" style="font-family:monospace;letter-spacing:0.05em;">
                <i class="bi bi-upc-scan me-1"></i>BC-{{ order.id | number:'6.0-0' }}-{{ order.createdAt | date:'yyyyMMdd' }}
              </span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <!-- Status badge -->
              <span class="badge bg-warning text-dark" *ngIf="order.status === 'PENDING'">
                <i class="bi bi-hourglass-split me-1"></i>En attente
              </span>
              <span class="badge bg-info" *ngIf="order.status === 'SHIPPED'">
                <i class="bi bi-truck me-1"></i>Expédiée
              </span>
              <span class="badge bg-success" *ngIf="order.status === 'DELIVERED'">
                <i class="bi bi-check-circle me-1"></i>Livrée
              </span>
              <span class="badge bg-danger" *ngIf="order.status === 'CANCELLED'">
                <i class="bi bi-x-circle me-1"></i>Annulée
              </span>
              <span class="badge bg-success" *ngIf="order.status === 'CONFIRMED'">
                <i class="bi bi-check-circle me-1"></i>Confirmée
              </span>
              <small class="text-muted">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
          </div>

          <!-- Order tracking bar -->
          <div class="px-4 pt-3 pb-1">
            <div class="d-flex align-items-center justify-content-between position-relative" style="margin-bottom:8px;">
              <div class="position-absolute" style="top:14px;left:10%;right:10%;height:3px;background:#e9ecef;z-index:0;">
                <div style="height:100%;background:#0d6efd;transition:width 0.5s;"
                     [style.width]="getTrackingProgress(order.status)"></div>
              </div>
              <div class="d-flex flex-column align-items-center position-relative" style="z-index:1;">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:30px;height:30px;"
                     [style.background]="isStepDone(order.status, 1) ? '#0d6efd' : '#e9ecef'">
                  <i class="bi bi-cart-check-fill" [style.color]="isStepDone(order.status, 1) ? '#fff' : '#adb5bd'" style="font-size:0.75rem;"></i>
                </div>
                <small class="text-muted mt-1" style="font-size:0.7rem;">Commandé</small>
              </div>
              <div class="d-flex flex-column align-items-center position-relative" style="z-index:1;">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:30px;height:30px;"
                     [style.background]="isStepDone(order.status, 2) ? '#0d6efd' : '#e9ecef'">
                  <i class="bi bi-box-seam-fill" [style.color]="isStepDone(order.status, 2) ? '#fff' : '#adb5bd'" style="font-size:0.75rem;"></i>
                </div>
                <small class="text-muted mt-1" style="font-size:0.7rem;">Traitement</small>
              </div>
              <div class="d-flex flex-column align-items-center position-relative" style="z-index:1;">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:30px;height:30px;"
                     [style.background]="isStepDone(order.status, 3) ? '#0d6efd' : '#e9ecef'">
                  <i class="bi bi-truck" [style.color]="isStepDone(order.status, 3) ? '#fff' : '#adb5bd'" style="font-size:0.75rem;"></i>
                </div>
                <small class="text-muted mt-1" style="font-size:0.7rem;">Expédiée</small>
              </div>
              <div class="d-flex flex-column align-items-center position-relative" style="z-index:1;">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:30px;height:30px;"
                     [style.background]="isStepDone(order.status, 4) ? '#198754' : '#e9ecef'">
                  <i class="bi bi-house-check-fill" [style.color]="isStepDone(order.status, 4) ? '#fff' : '#adb5bd'" style="font-size:0.75rem;"></i>
                </div>
                <small class="text-muted mt-1" style="font-size:0.7rem;">Livrée</small>
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="row mb-1" *ngFor="let item of order.items">
              <div class="col-6 fw-semibold">
                <i class="bi bi-book me-1 text-muted"></i>{{ item.productTitle }}
              </div>
              <div class="col-3 text-muted">x{{ item.quantity }}</div>
              <div class="col-3 text-end text-primary fw-semibold">{{ item.subtotal }} MAD</div>
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
              <a routerLink="/catalog" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-grid me-1"></i>Continuer mes achats
              </a>
              <strong class="text-primary fs-5">Total : {{ order.total }} MAD</strong>
            </div>
          </div>
        </div>

        <!-- You might also like -->
        <div class="mt-5" *ngIf="suggestedBooks.length > 0">
          <h4 class="fw-bold mb-3"><i class="bi bi-stars me-2 text-warning"></i>Vous aimerez peut-être</h4>
          <div class="row g-3">
            <div class="col-md-4" *ngFor="let book of suggestedBooks">
              <div class="card border-0 shadow-sm h-100">
                <img [src]="book.imageUrl || 'https://via.placeholder.com/300x200?text=Book'"
                     class="card-img-top" style="height:180px;object-fit:cover;"
                     (error)="onImgError($event)">
                <div class="card-body">
                  <span class="badge bg-secondary mb-1">{{ book.categoryName }}</span>
                  <h6 class="fw-bold mb-1">{{ book.title }}</h6>
                  <small class="text-muted fst-italic">{{ book.author }}</small>
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="fw-bold text-primary">{{ book.price }} MAD</span>
                    <a [routerLink]="['/catalog/product', book.id]" class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-eye me-1"></i>Voir
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  suggestedBooks: any[] = [];
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
        this.orders = orders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
        this.loadSuggestedBooks();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur commandes', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSuggestedBooks(): void {
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (books) => {
        const orderedIds = new Set(
          this.orders.flatMap(o => o.items.map((i: any) => i.productId))
        );
        const notOrdered = books.filter(b => !orderedIds.has(b.id) && b.stock > 0);
        this.suggestedBooks = notOrdered.sort(() => Math.random() - 0.5).slice(0, 3);
        this.cdr.detectChanges();
      }
    });
  }

  getTrackingProgress(status: string): string {
    const map: any = { 'PENDING': '10%', 'CONFIRMED': '40%', 'SHIPPED': '70%', 'DELIVERED': '100%', 'CANCELLED': '10%' };
    return map[status] || '10%';
  }

  isStepDone(status: string, step: number): boolean {
    const steps: any = { 'PENDING': 1, 'CONFIRMED': 2, 'SHIPPED': 3, 'DELIVERED': 4, 'CANCELLED': 0 };
    return (steps[status] || 0) >= step;
  }

  onImgError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x200?text=Book';
  }
}