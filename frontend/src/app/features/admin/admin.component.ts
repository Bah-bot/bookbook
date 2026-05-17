import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4" style="max-width:1400px;margin:0 auto;">

      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fw-bold mb-0">
            <i class="bi bi-shield-lock-fill text-warning me-2"></i>Administration
          </h2>
          <small class="text-muted">Tableau de bord BookCorner</small>
        </div>
        <span class="badge bg-danger fs-6">ADMIN</span>
      </div>

      <!-- Alerts -->
      <div class="alert alert-success alert-dismissible" *ngIf="successMsg">
        <i class="bi bi-check-circle me-2"></i>{{ successMsg }}
      </div>
      <div class="alert alert-danger alert-dismissible" *ngIf="errorMsg">
        <i class="bi bi-exclamation-circle me-2"></i>{{ errorMsg }}
      </div>

      <!-- TABS -->
      <ul class="nav nav-tabs mb-4 border-bottom">
        <li class="nav-item">
          <button class="nav-link fw-semibold" [class.active]="tab==='stats'" (click)="tab='stats'">
            <i class="bi bi-bar-chart-fill me-1"></i>Dashboard
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-semibold" [class.active]="tab==='books'" (click)="tab='books'">
            <i class="bi bi-book-fill me-1"></i>Livres
            <span class="badge bg-secondary ms-1">{{ books.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-semibold" [class.active]="tab==='orders'" (click)="tab='orders'">
            <i class="bi bi-bag-fill me-1"></i>Commandes
            <span class="badge bg-secondary ms-1">{{ orders.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-semibold" [class.active]="tab==='reviews'" (click)="tab='reviews'">
            <i class="bi bi-star-fill me-1 text-warning"></i>Avis
            <span class="badge bg-secondary ms-1">{{ reviews.length }}</span>
          </button>
        </li>
      </ul>

      <!-- TAB: STATS -->
      <div *ngIf="tab==='stats'">
        <div class="row g-3 mb-4">
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100" style="border-left:4px solid #0d6efd!important;">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:54px;height:54px;background:rgba(13,110,253,0.12);">
                  <i class="bi bi-book-fill text-primary fs-4"></i>
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-semibold" style="letter-spacing:.05em;">Livres</div>
                  <div class="fs-2 fw-bold">{{ stats.totalBooks || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100" style="border-left:4px solid #198754!important;">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:54px;height:54px;background:rgba(25,135,84,0.12);">
                  <i class="bi bi-people-fill text-success fs-4"></i>
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-semibold" style="letter-spacing:.05em;">Utilisateurs</div>
                  <div class="fs-2 fw-bold">{{ stats.totalUsers || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100" style="border-left:4px solid #fd7e14!important;">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:54px;height:54px;background:rgba(253,126,20,0.12);">
                  <i class="bi bi-bag-fill text-warning fs-4"></i>
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-semibold" style="letter-spacing:.05em;">Commandes</div>
                  <div class="fs-2 fw-bold">{{ stats.totalOrders || 0 }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card border-0 shadow-sm h-100" style="border-left:4px solid #c9a84c!important;">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="rounded-circle d-flex align-items-center justify-content-center"
                     style="width:54px;height:54px;background:rgba(201,168,76,0.12);">
                  <i class="bi bi-cash-stack fs-4" style="color:#c9a84c;"></i>
                </div>
                <div>
                  <div class="text-muted small text-uppercase fw-semibold" style="letter-spacing:.05em;">Revenus</div>
                  <div class="fs-2 fw-bold">{{ stats.totalRevenue || 0 }} <small class="fs-6 fw-normal text-muted">MAD</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <div class="display-6 fw-bold text-warning">{{ stats.pendingOrders || 0 }}</div>
                <div class="text-muted small mt-1"><i class="bi bi-hourglass-split me-1"></i>Commandes en attente</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <div class="display-6 fw-bold text-danger">{{ stats.lowStockBooks || 0 }}</div>
                <div class="text-muted small mt-1"><i class="bi bi-exclamation-triangle me-1"></i>Livres stock faible (≤5)</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center">
                <div class="display-6 fw-bold text-info">{{ stats.totalReviews || 0 }}</div>
                <div class="text-muted small mt-1"><i class="bi bi-star me-1"></i>Avis publiés</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent orders -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-transparent fw-semibold border-bottom">
            <i class="bi bi-clock-history me-2"></i>Commandes récentes
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Livres commandés</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let o of orders.slice(0,5)">
                  <td><small class="text-muted">#{{ o.id }}</small></td>
                  <td><i class="bi bi-person-circle me-1 text-muted"></i>{{ o.userEmail || '—' }}</td>
                  <td>
                    <div *ngFor="let item of o.items" class="small">
                      <i class="bi bi-book me-1 text-muted"></i>
                      {{ item.productTitle }}
                      <span class="badge bg-secondary ms-1">x{{ item.quantity }}</span>
                    </div>
                  </td>
                  <td class="fw-semibold">{{ o.total }} MAD</td>
                  <td>
                    <span class="badge"
                          [class.bg-warning]="o.status==='PENDING'"
                          [class.bg-info]="o.status==='SHIPPED'"
                          [class.bg-success]="o.status==='DELIVERED'"
                          [class.bg-danger]="o.status==='CANCELLED'"
                          [class.text-dark]="o.status==='PENDING'">
                      {{ o.status }}
                    </span>
                  </td>
                  <td><small>{{ o.createdAt | date:'dd/MM/yyyy' }}</small></td>
                </tr>
                <tr *ngIf="orders.length === 0">
                  <td colspan="6" class="text-center text-muted py-3">Aucune commande</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Latest reviews on dashboard -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent fw-semibold border-bottom">
            <i class="bi bi-chat-quote-fill me-2 text-warning"></i>Derniers avis
          </div>
          <div class="card-body p-0">
            <div *ngFor="let r of reviews.slice(0,5)"
                 class="d-flex align-items-start gap-3 p-3 border-bottom">
              <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                   style="width:42px;height:42px;background:rgba(201,168,76,0.12);">
                <i class="bi bi-person-fill" style="color:#c9a84c;"></i>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold small">{{ r.username }}</span>
                  <small class="text-muted">{{ r.createdAt | date:'dd/MM/yyyy' }}</small>
                </div>
                <div class="mb-1">
                  <span *ngFor="let s of [1,2,3,4,5]"
                        [style.color]="s <= r.rating ? '#ffc107' : '#dee2e6'"
                        style="font-size:0.9rem;">★</span>
                  <span class="badge bg-secondary ms-2 small">{{ getBookTitle(r.productId) }}</span>
                </div>
                <p class="mb-0 small text-muted fst-italic">"{{ r.comment }}"</p>
              </div>
              <button class="btn btn-sm btn-outline-danger flex-shrink-0" (click)="deleteReview(r.id)">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
            <div *ngIf="reviews.length === 0" class="text-center text-muted py-4">Aucun avis</div>
          </div>
        </div>
      </div>

      <!-- TAB: BOOKS -->
      <div *ngIf="tab==='books'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Gestion des livres</h5>
          <button class="btn btn-primary" (click)="openBookForm()">
            <i class="bi bi-plus-circle me-1"></i>Ajouter un livre
          </button>
        </div>

        <div class="card border-0 shadow-sm mb-4" *ngIf="showBookForm">
          <div class="card-header bg-transparent fw-semibold border-bottom">
            {{ editingBook ? '✏️ Modifier le livre' : '➕ Nouveau livre' }}
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Titre *</label>
                <input class="form-control" [(ngModel)]="bookForm.title" placeholder="Titre du livre">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Auteur *</label>
                <input class="form-control" [(ngModel)]="bookForm.author" placeholder="Auteur">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Prix (MAD) *</label>
                <input class="form-control" type="number" [(ngModel)]="bookForm.price">
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Stock initial</label>
                <input class="form-control" type="number" [(ngModel)]="bookForm.initialStock">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Catégorie *</label>
                <select class="form-select" [(ngModel)]="bookForm.categoryId">
                  <option value="">-- Choisir --</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">ISBN</label>
                <input class="form-control" [(ngModel)]="bookForm.isbn">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">URL Image</label>
                <input class="form-control" [(ngModel)]="bookForm.imageUrl" placeholder="https://...">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Description</label>
                <textarea class="form-control" rows="2" [(ngModel)]="bookForm.description"></textarea>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button class="btn btn-success" (click)="saveBook()" [disabled]="savingBook">
                <span class="spinner-border spinner-border-sm me-1" *ngIf="savingBook"></span>
                {{ editingBook ? 'Enregistrer' : 'Créer' }}
              </button>
              <button class="btn btn-outline-secondary" (click)="cancelBookForm()">Annuler</button>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-dark">
                <tr>
                  <th>Couverture</th>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Prix</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let book of books">
                  <td>
                    <img [src]="book.imageUrl || 'https://via.placeholder.com/40x56?text=Book'"
                         style="width:36px;height:50px;object-fit:cover;border-radius:3px;">
                  </td>
                  <td class="fw-semibold">{{ book.title }}</td>
                  <td class="text-muted fst-italic">{{ book.author }}</td>
                  <td class="fw-bold text-primary">{{ book.price }} MAD</td>
                  <td><span class="badge bg-secondary">{{ book.categoryName }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="editBook(book)">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteBook(book.id)">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="books.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">Aucun livre</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: ORDERS -->
      <div *ngIf="tab==='orders'">
        <h5 class="fw-bold mb-3">Gestion des commandes</h5>
        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-dark">
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Livres commandés</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Changer statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let o of orders">
                  <td><small class="text-muted fw-semibold">#{{ o.id }}</small></td>
                  <td><i class="bi bi-person-circle me-1 text-muted"></i>{{ o.userEmail || '—' }}</td>
                  <td>
                    <div *ngFor="let item of o.items" class="small">
                      <i class="bi bi-book me-1 text-muted"></i>
                      {{ item.productTitle }}
                      <span class="badge bg-secondary ms-1">x{{ item.quantity }}</span>
                    </div>
                  </td>
                  <td class="fw-bold">{{ o.total }} MAD</td>
                  <td>
                    <span class="badge fs-6"
                          [class.bg-warning]="o.status==='PENDING'"
                          [class.bg-info]="o.status==='SHIPPED'"
                          [class.bg-success]="o.status==='DELIVERED'"
                          [class.bg-danger]="o.status==='CANCELLED'"
                          [class.text-dark]="o.status==='PENDING'">
                      {{ o.status }}
                    </span>
                  </td>
                  <td><small>{{ o.createdAt | date:'dd/MM/yyyy HH:mm' }}</small></td>
                  <td>
                    <select class="form-select form-select-sm" style="width:160px;"
                            [value]="o.status"
                            (change)="updateOrderStatus(o.id, $any($event.target).value)">
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
                <tr *ngIf="orders.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">Aucune commande</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: REVIEWS -->
      <div *ngIf="tab==='reviews'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0"><i class="bi bi-chat-quote-fill text-warning me-2"></i>Avis des lecteurs</h5>
          <span class="text-muted small">{{ reviews.length }} avis au total</span>
        </div>

        <div *ngFor="let group of reviewGroups" class="mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-book-fill text-primary"></i>
                <span class="fw-bold">{{ group.bookTitle }}</span>
                <span class="badge bg-primary ms-1">{{ group.reviews.length }} avis</span>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span *ngFor="let s of [1,2,3,4,5]"
                      [style.color]="s <= group.avgRating ? '#ffc107' : '#dee2e6'"
                      style="font-size:1rem;">★</span>
                <small class="text-muted ms-1">{{ group.avgRating }}/5</small>
              </div>
            </div>
            <div class="card-body p-0">
              <div *ngFor="let r of group.reviews"
                   class="d-flex align-items-start gap-3 p-3 border-bottom">
                <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style="width:40px;height:40px;background:rgba(13,110,253,0.1);">
                  <i class="bi bi-person-fill text-primary"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="fw-semibold small">{{ r.username }}</span>
                    <small class="text-muted">{{ r.createdAt | date:'dd/MM/yyyy' }}</small>
                  </div>
                  <div class="mb-1">
                    <span *ngFor="let s of [1,2,3,4,5]"
                          [style.color]="s <= r.rating ? '#ffc107' : '#dee2e6'"
                          style="font-size:0.85rem;">★</span>
                  </div>
                  <p class="mb-0 small fst-italic text-muted">"{{ r.comment }}"</p>
                </div>
                <button class="btn btn-sm btn-outline-danger flex-shrink-0"
                        (click)="deleteReview(r.id)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="reviews.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-chat-dots display-4"></i>
          <p class="mt-3">Aucun avis pour le moment</p>
        </div>
      </div>

    </div>
  `
})
export class AdminComponent implements OnInit {
  tab = 'stats';
  stats: any = {};
  books: any[] = [];
  orders: any[] = [];
  reviews: any[] = [];
  reviewGroups: any[] = [];
  categories: any[] = [];

  showBookForm = false;
  editingBook: any = null;
  savingBook = false;

  bookForm = {
    title: '', author: '', description: '',
    price: 0, initialStock: 0,
    categoryId: '' as any, isbn: '', imageUrl: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadOrders();
    this.loadCategories();
    this.loadBooksFirst();
  }

  // Load books first, then reviews so titles are available
  loadBooksFirst(): void {
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (b) => {
        this.books = b;
        this.loadReviews();
        this.cdr.detectChanges();
      }
    });
  }

  loadBooks(): void {
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (b) => { this.books = b; this.cdr.detectChanges(); }
    });
  }

  loadStats(): void {
    this.http.get<any>('http://localhost:8080/api/admin/stats').subscribe({
      next: (s) => { this.stats = s; this.cdr.detectChanges(); }
    });
  }

  loadOrders(): void {
    this.http.get<any[]>('http://localhost:8080/api/admin/orders').subscribe({
      next: (o) => { this.orders = o; this.cdr.detectChanges(); }
    });
  }

  loadCategories(): void {
    this.http.get<any[]>('http://localhost:8080/api/categories').subscribe({
      next: (c) => { this.categories = c; this.cdr.detectChanges(); }
    });
  }

loadReviews(): void {
  this.http.get<any[]>('http://localhost:8080/api/admin/reviews').subscribe({
    next: (reviews) => {
      this.reviews = reviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.buildReviewGroups(reviews);
      this.cdr.detectChanges();
    }
  });
}
  buildReviewGroups(reviews: any[]): void {
    const map = new Map<number, any>();
    for (const r of reviews) {
      if (!map.has(r.productId)) {
        const book = this.books.find(b => b.id === r.productId);
        map.set(r.productId, {
          productId: r.productId,
          bookTitle: book ? book.title : 'Livre #' + r.productId,
          reviews: [],
          avgRating: 0
        });
      }
      map.get(r.productId).reviews.push(r);
    }
    for (const group of map.values()) {
      const avg = group.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / group.reviews.length;
      group.avgRating = Math.round(avg * 10) / 10;
    }
    this.reviewGroups = Array.from(map.values())
      .sort((a, b) => b.reviews.length - a.reviews.length);
  }

  getBookTitle(productId: number): string {
    const book = this.books.find(b => b.id === productId);
    return book ? book.title : 'Livre #' + productId;
  }

  openBookForm(): void {
    this.editingBook = null;
    this.bookForm = { title: '', author: '', description: '', price: 0, initialStock: 0, categoryId: '', isbn: '', imageUrl: '' };
    this.showBookForm = true;
    window.scrollTo(0, 0);
  }

  editBook(book: any): void {
    this.editingBook = book;
    this.bookForm = {
      title: book.title, author: book.author,
      description: book.description || '',
      price: book.price, initialStock: 0,
      categoryId: book.categoryId || '',
      isbn: book.isbn || '', imageUrl: book.imageUrl || ''
    };
    this.showBookForm = true;
    window.scrollTo(0, 0);
  }

  cancelBookForm(): void {
    this.showBookForm = false;
    this.editingBook = null;
  }

  saveBook(): void {
    if (!this.bookForm.title || !this.bookForm.author || !this.bookForm.categoryId) {
      this.showError('Titre, auteur et categorie sont obligatoires.');
      return;
    }
    this.savingBook = true;
    const url = this.editingBook
      ? `http://localhost:8080/api/admin/products/${this.editingBook.id}`
      : 'http://localhost:8080/api/admin/products';
    const call = this.editingBook
      ? this.http.put<any>(url, this.bookForm)
      : this.http.post<any>(url, this.bookForm);

    call.subscribe({
      next: () => {
        this.savingBook = false;
        this.showBookForm = false;
        this.editingBook = null;
        this.loadBooks();
        this.loadStats();
        this.showSuccess(this.editingBook ? 'Livre modifie !' : 'Livre cree !');
      },
      error: () => { this.savingBook = false; this.showError('Erreur lors de la sauvegarde.'); }
    });
  }

  deleteBook(id: number): void {
    if (!confirm('Supprimer ce livre ?')) return;
    this.http.delete(`http://localhost:8080/api/admin/products/${id}`).subscribe({
      next: () => { this.loadBooks(); this.loadStats(); this.showSuccess('Livre supprime !'); },
      error: () => this.showError('Erreur lors de la suppression.')
    });
  }

  updateOrderStatus(id: number, status: string): void {
    this.http.put(`http://localhost:8080/api/admin/orders/${id}/status`, { status }).subscribe({
      next: () => { this.loadOrders(); this.loadStats(); this.showSuccess('Statut mis a jour !'); },
      error: () => this.showError('Erreur lors de la mise a jour.')
    });
  }

  deleteReview(id: number): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.http.delete(`http://localhost:8080/api/admin/reviews/${id}`).subscribe({
      next: () => { this.loadBooksFirst(); this.loadStats(); this.showSuccess('Avis supprime !'); },
      error: () => this.showError('Erreur lors de la suppression.')
    });
  }

  showSuccess(msg: string): void {
    this.successMsg = msg; this.errorMsg = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.successMsg = ''; this.cdr.detectChanges(); }, 3000);
  }

  showError(msg: string): void {
    this.errorMsg = msg; this.successMsg = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.errorMsg = ''; this.cdr.detectChanges(); }, 4000);
  }
}