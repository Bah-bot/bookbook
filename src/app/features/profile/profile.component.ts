import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-7">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0"><i class="bi bi-person-circle me-2"></i>Mon Profil</h4>
            </div>
            <div class="card-body p-4">
              <div class="alert alert-info mb-3">
                <i class="bi bi-envelope me-2"></i>
                <strong>Email :</strong> {{ currentUser?.email }}
                <span class="badge bg-secondary ms-2">{{ currentUser?.role }}</span>
              </div>
              <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
              <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Prénom</label>
                    <input type="text" class="form-control" formControlName="firstName" placeholder="Prénom">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Nom</label>
                    <input type="text" class="form-control" formControlName="lastName" placeholder="Nom">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Téléphone</label>
                  <input type="text" class="form-control" formControlName="phone" placeholder="+212 6XX XXX XXX">
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Adresse</label>
                  <input type="text" class="form-control" formControlName="address" placeholder="Rue, N°...">
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Ville</label>
                    <input type="text" class="form-control" formControlName="city" placeholder="Ville">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Pays</label>
                    <input type="text" class="form-control" formControlName="country" placeholder="Maroc">
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" [disabled]="saving">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="saving"></span>
                  <i class="bi bi-save me-2" *ngIf="!saving"></i>
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: [''], lastName: [''], phone: [''],
      address: [''], city: [''], country: ['']
    });
  }

  get currentUser() { return this.authService.currentUser; }

  ngOnInit(): void {
    const userId = this.currentUser?.id;
    this.http.get<any>(`http://localhost:8080/api/users/${userId}/profile`).subscribe({
      next: (profile) => this.profileForm.patchValue(profile),
      error: () => {}
    });
  }

  onSubmit(): void {
    this.saving = true;
    const userId = this.currentUser?.id;
    this.http.put<any>(`http://localhost:8080/api/users/${userId}/profile`, this.profileForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Erreur lors de la mise à jour';
      }
    });
  }
}