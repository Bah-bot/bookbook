import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h2 class="text-center mb-4 fw-bold">
                <i class="bi bi-person-plus text-primary me-2"></i>Inscription
              </h2>
              <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
              <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input type="email" class="form-control" formControlName="email"
                         placeholder="votre@email.com"
                         [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  <div class="invalid-feedback">Email invalide</div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Mot de passe</label>
                  <input type="password" class="form-control" formControlName="password"
                         placeholder="Min. 6 caractères"
                         [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  <div class="invalid-feedback">Minimum 6 caractères</div>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold"
                        [disabled]="registerForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  Créer mon compte
                </button>
              </form>
              <hr>
              <p class="text-center mb-0">
                Déjà un compte ?
                <a routerLink="/auth/login" class="text-primary fw-semibold">Se connecter</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Compte créé ! Redirection...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error || 'Erreur lors de l\'inscription';
      }
    });
  }
}