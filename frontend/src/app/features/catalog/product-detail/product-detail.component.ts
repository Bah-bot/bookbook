import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <a routerLink="/catalog" class="btn btn-outline-secondary mb-4">
        <i class="bi bi-arrow-left me-2"></i>Retour au catalogue
      </a>

      <div class="text-center py-5" *ngIf="loading">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2 text-muted">Chargement...</p>
      </div>

      <div class="row" *ngIf="product && !loading">
        <div class="col-md-4 text-center mb-4">
          <img [src]="product.imageUrl || 'https://via.placeholder.com/300x400?text=Book'"
               class="img-fluid rounded shadow"
               style="max-height: 400px; object-fit: cover;">
        </div>

        <div class="col-md-8">
          <span class="badge bg-secondary mb-2 fs-6">{{ product.categoryName }}</span>
          <h1 class="fw-bold mb-1">{{ product.title }}</h1>
          <p class="text-muted fs-5 mb-1">par <strong>{{ product.author }}</strong></p>
          <p class="text-muted mb-3"><small><strong>ISBN :</strong> {{ product.isbn }}</small></p>

          <div class="d-flex align-items-center gap-3 mb-3">
            <span class="fs-2 fw-bold text-primary">{{ product.price }} MAD</span>
            <span class="badge fs-6 p-2"
                  [class.bg-success]="product.stock > 0"
                  [class.bg-danger]="product.stock === 0">
              {{ product.stock > 0 ? product.stock + ' en stock' : 'Épuisé' }}
            </span>
          </div>

          <hr>
          <p class="lead">{{ product.description }}</p>

          <div class="alert alert-success" *ngIf="successMessage">
            <i class="bi bi-check-circle me-2"></i>{{ successMessage }}
          </div>
          <div class="alert alert-danger" *ngIf="errorMessage">
            <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
          </div>

          <div *ngIf="product.stock > 0 && isLoggedIn">
            <div class="d-flex gap-3 align-items-center mt-3">
              <div class="input-group" style="width: 140px;">
                <button class="btn btn-outline-secondary" (click)="decreaseQty()">-</button>
                <input type="number" class="form-control text-center fw-bold"
                       [(ngModel)]="quantity" min="1" [max]="product.stock">
                <button class="btn btn-outline-secondary" (click)="increaseQty()">+</button>
              </div>
              <button class="btn btn-primary btn-lg px-4 fw-semibold"
                      (click)="addToCart()" [disabled]="addingToCart">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="addingToCart"></span>
                <i class="bi bi-cart-plus me-2" *ngIf="!addingToCart"></i>
                Ajouter au panier
              </button>
            </div>
            <div class="mt-3" *ngIf="addedToCart">
              <a routerLink="/cart" class="btn btn-success px-4">
                <i class="bi bi-cart3 me-2"></i>Voir mon panier
              </a>
            </div>
          </div>

          <div class="mt-3" *ngIf="!isLoggedIn">
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <a routerLink="/auth/login" class="alert-link fw-bold">Connectez-vous</a>
              pour ajouter ce livre au panier
            </div>
          </div>

          <div class="alert alert-warning mt-3" *ngIf="product.stock === 0">
            Ce livre est actuellement épuisé.
          </div>
        </div>
      </div>

      <!-- ===================== REVIEWS SECTION ===================== -->
      <div class="mt-5" *ngIf="product && !loading">
        <hr>
        <h3 class="fw-bold mb-4"><i class="bi bi-star-fill text-warning me-2"></i>Avis des lecteurs</h3>

        <!-- Submit Review Form (only if logged in) -->
        <div class="card mb-4 shadow-sm" *ngIf="isLoggedIn">
          <div class="card-body">
            <h5 class="card-title mb-3">Laisser un avis</h5>

            <!-- Star Rating Selector -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Note :</label>
              <div class="d-flex gap-1">
                <span *ngFor="let star of [1,2,3,4,5]"
                      (click)="newReview.rating = star"
                      style="cursor: pointer; font-size: 1.8rem;"
                      [style.color]="star <= newReview.rating ? '#ffc107' : '#dee2e6'">
                  &#9733;
                </span>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Commentaire :</label>
              <textarea class="form-control" rows="3"
                        [(ngModel)]="newReview.comment"
                        placeholder="Partagez votre avis sur ce livre..."></textarea>
            </div>

            <div class="alert alert-success" *ngIf="reviewSuccess">
              <i class="bi bi-check-circle me-2"></i>Votre avis a été publié !
            </div>
            <div class="alert alert-danger" *ngIf="reviewError">
              <i class="bi bi-exclamation-circle me-2"></i>{{ reviewError }}
            </div>

            <button class="btn btn-primary" (click)="submitReview()" [disabled]="submittingReview">
              <span class="spinner-border spinner-border-sm me-2" *ngIf="submittingReview"></span>
              <i class="bi bi-send me-2" *ngIf="!submittingReview"></i>
              Publier mon avis
            </button>
          </div>
        </div>

        <div class="alert alert-info" *ngIf="!isLoggedIn">
          <i class="bi bi-info-circle me-2"></i>
          <a routerLink="/auth/login" class="alert-link fw-bold">Connectez-vous</a>
          pour laisser un avis.
        </div>

        <!-- Reviews List -->
        <div class="text-center py-3" *ngIf="loadingReviews">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <span class="ms-2 text-muted">Chargement des avis...</span>
        </div>

        <div *ngIf="!loadingReviews">
          <p class="text-muted" *ngIf="reviews.length === 0">
            <i class="bi bi-chat-dots me-2"></i>Aucun avis pour ce livre. Soyez le premier !
          </p>

          <div class="card mb-3 shadow-sm" *ngFor="let review of reviews">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong><i class="bi bi-person-circle me-1"></i>{{ review.username }}</strong>
                  <div class="mt-1">
                    <span *ngFor="let star of [1,2,3,4,5]"
                          style="font-size: 1.2rem;"
                          [style.color]="star <= review.rating ? '#ffc107' : '#dee2e6'">
                      &#9733;
                    </span>
                  </div>
                </div>
                <small class="text-muted">{{ review.createdAt | date:'dd/MM/yyyy' }}</small>
              </div>
              <p class="mb-0">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- ===================== END REVIEWS ===================== -->

    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  quantity = 1;
  addingToCart = false;
  addedToCart = false;
  successMessage = '';
  errorMessage = '';

  // Reviews
  reviews: any[] = [];
  loadingReviews = false;
  submittingReview = false;
  reviewSuccess = false;
  reviewError = '';
  newReview = { rating: 0, comment: '' };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`http://localhost:8080/api/products/${id}`).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
          this.loadReviews(product.id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadReviews(productId: number): void {
    this.loadingReviews = true;
    this.http.get<any[]>(`http://localhost:8080/api/reviews/product/${productId}`).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loadingReviews = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingReviews = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitReview(): void {
    if (this.newReview.rating === 0) {
      this.reviewError = 'Veuillez sélectionner une note.';
      return;
    }
    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Veuillez écrire un commentaire.';
      return;
    }

    this.submittingReview = true;
    this.reviewError = '';
    this.reviewSuccess = false;

    const currentUser = this.authService.currentUser;
    const payload = {
      productId: this.product.id,
      username: currentUser?.email || 'Anonyme',
      comment: this.newReview.comment,
      rating: this.newReview.rating
    };

    this.http.post<any>('http://localhost:8080/api/reviews', payload).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { rating: 0, comment: '' };
        this.submittingReview = false;
        this.reviewSuccess = true;
        setTimeout(() => this.reviewSuccess = false, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.submittingReview = false;
        this.reviewError = 'Erreur lors de la publication. Réessayez.';
        this.cdr.detectChanges();
      }
    });
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.addingToCart = true;
    this.errorMessage = '';
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.addingToCart = false;
        this.addedToCart = true;
        this.successMessage = `"${this.product.title}" ajouté au panier !`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/cart']);
        }, 1000);
      },
      error: (err: any) => {
        this.addingToCart = false;
        this.errorMessage = err.error || 'Erreur lors de l\'ajout au panier';
        this.cdr.detectChanges();
      }
    });
  }
}