import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="text-center mb-4 fw-bold">
                <i class="bi bi-book-half text-primary me-2"></i>Connexion
              </h2>
              <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
              <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input type="email" class="form-control" formControlName="email"
                         placeholder="votre@email.com"
                         [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <div class="invalid-feedback">Email invalide</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Mot de passe</label>
                  <input type="password" class="form-control" formControlName="password"
                         placeholder="••••••"
                         [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <div class="invalid-feedback">Mot de passe obligatoire</div>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold"
                        [disabled]="loginForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  Connexion
                </button>
              </form>
              <hr>
              <p class="text-center mb-0">
                Pas encore de compte ?
                <a routerLink="/auth/register" class="text-primary fw-semibold">S'inscrire</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/catalog']);
      },
      error: (err: any) => {
        this.loading = false;
        const status = err.status;
        if (status === 404) {
          this.errorMessage = 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.';
        } else if (status === 401) {
          this.errorMessage = 'Mot de passe incorrect. Veuillez réessayer.';
        } else {
          this.errorMessage = err.error || 'Email ou mot de passe incorrect.';
        }
      }
    });
  }
}