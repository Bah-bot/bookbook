import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="bg-dark text-white rounded-3 p-5 mb-4 text-center">
        <h1 class="display-5 fw-bold mb-2">📚 BookCorner</h1>
        <p class="lead mb-3">Découvrez notre sélection de livres</p>
        <div class="input-group mx-auto" style="max-width: 500px;">
          <input type="text" class="form-control form-control-lg"
                 placeholder="Rechercher un livre, un auteur..."
                 [(ngModel)]="searchKeyword"
                 (keyup.enter)="search()">
          <button class="btn btn-primary px-4" (click)="search()">
            <i class="bi bi-search"></i>
          </button>
          <button class="btn btn-outline-light" *ngIf="searchKeyword" (click)="clearSearch()">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-primary text-white fw-semibold">
              <i class="bi bi-tags me-2"></i>Catégories
            </div>
            <div class="list-group list-group-flush">
              <button class="list-group-item list-group-item-action"
                      [class.active]="selectedCategoryId === null"
                      (click)="filterByCategory(null)">
                Tous les livres
              </button>
              <button *ngFor="let cat of categories"
                      class="list-group-item list-group-item-action"
                      [class.active]="selectedCategoryId === cat.id"
                      (click)="filterByCategory(cat.id)">
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">{{ products.length }} livre(s) trouvé(s)</span>
            <span class="badge bg-info text-dark" *ngIf="searchKeyword">
              Recherche : "{{ searchKeyword }}"
            </span>
          </div>

          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Chargement des livres...</p>
          </div>

          <div class="row g-3" *ngIf="!loading">
            <div class="col-md-4" *ngFor="let product of products">
              <div class="card h-100 border-0 shadow-sm">
                <img [src]="product.imageUrl || 'https://via.placeholder.com/200x280?text=Book'"
                     class="card-img-top" alt="{{ product.title }}"
                     style="height: 200px; object-fit: cover;"
                     (error)="onImgError($event)">
                <div class="card-body d-flex flex-column">
                  <span class="badge bg-secondary mb-1 align-self-start">{{ product.categoryName }}</span>
                  <h6 class="card-title fw-bold mb-1">{{ product.title }}</h6>
                  <small class="text-muted mb-2">{{ product.author }}</small>
                  <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold text-primary fs-5">{{ product.price }} MAD</span>
                      <span class="badge"
                            [class.bg-success]="product.stock > 0"
                            [class.bg-danger]="product.stock === 0">
                        {{ product.stock > 0 ? 'En stock' : 'Épuisé' }}
                      </span>
                    </div>
                    <a [routerLink]="['/catalog/product', product.id]"
                       class="btn btn-outline-primary w-100 mt-2 btn-sm">
                      <i class="bi bi-eye me-1"></i>Voir le détail
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 text-center py-5" *ngIf="products.length === 0 && !loading">
              <i class="bi bi-search display-3 text-muted"></i>
              <p class="text-muted mt-3">Aucun livre trouvé</p>
              <button class="btn btn-outline-primary" (click)="clearSearch()">Voir tous les livres</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = false;
  searchKeyword = '';
  selectedCategoryId: number | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.products = [];
    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategories(): void {
    this.http.get<any[]>('http://localhost:8080/api/categories').subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    if (!this.searchKeyword.trim()) { this.loadProducts(); return; }
    this.loading = true;
    this.products = [];
    this.selectedCategoryId = null;
    this.http.get<any[]>(`http://localhost:8080/api/products/search?keyword=${this.searchKeyword}`).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.searchKeyword = '';
    if (!categoryId) { this.loadProducts(); return; }
    this.loading = true;
    this.products = [];
    this.http.get<any[]>(`http://localhost:8080/api/products/category/${categoryId}`).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.selectedCategoryId = null;
    this.loadProducts();
  }

  onImgError(event: any): void {
    event.target.src = 'https://via.placeholder.com/200x280?text=Book';
  }
}