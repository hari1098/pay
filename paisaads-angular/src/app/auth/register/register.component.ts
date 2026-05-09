import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../shared/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Join PaisaAds and start posting ads</p>
        </div>

        @if (errorMsg()) {
          <div class="alert alert-error">{{ errorMsg() }}</div>
        }

        @if (successMsg()) {
          <div class="alert alert-success">{{ successMsg() }}</div>
        }

        <form (ngSubmit)="onRegister()" class="register-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              type="text"
              [(ngModel)]="name"
              name="name"
              class="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              [(ngModel)]="phone"
              name="phone"
              class="form-control"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              class="form-control"
              placeholder="Enter your email address"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              class="form-control"
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" class="btn-register" [disabled]="submitting()">
            @if (submitting()) {
              <span class="spinner"></span> Creating account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <div class="register-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      padding: 2rem;
    }
    .register-card {
      width: 100%;
      max-width: 440px;
      background: #fff;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .register-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .register-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1a1a2e;
      margin: 0 0 0.5rem;
    }
    .register-header p {
      color: #6b7280;
      margin: 0;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
    }
    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .register-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
    }
    .form-control {
      padding: 0.7rem 0.875rem;
      border: 1.5px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: #e94560;
      box-shadow: 0 0 0 3px rgba(233,69,96,0.15);
    }

    .btn-register {
      width: 100%;
      padding: 0.75rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-register:hover:not(:disabled) { background: #d63851; }
    .btn-register:disabled { opacity: 0.7; cursor: not-allowed; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .register-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .register-footer p { color: #6b7280; font-size: 0.9rem; margin: 0; }
    .register-footer a { color: #e94560; font-weight: 600; text-decoration: none; }
    .register-footer a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  phone = '';
  email = '';
  password = '';
  submitting = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  onRegister(): void {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.name || !this.phone || !this.password) {
      this.errorMsg.set('Name, phone number, and password are required.');
      return;
    }

    this.submitting.set(true);
    const data: RegisterRequest = {
      name: this.name,
      phoneNumber: this.phone,
      password: this.password,
      email: this.email || undefined
    };

    this.auth.register(data).subscribe({
      next: () => {
        this.successMsg.set('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Registration failed. Please try again.');
      },
      complete: () => this.submitting.set(false)
    });
  }
}
