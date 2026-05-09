import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../shared/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your PaisaAds account</p>
        </div>

        @if (errorMsg()) {
          <div class="alert alert-error">{{ errorMsg() }}</div>
        }

        <form (ngSubmit)="onLogin()" class="login-form">
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
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              class="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" class="btn-login" [disabled]="submitting()">
            @if (submitting()) {
              <span class="spinner"></span> Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      padding: 2rem;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1a1a2e;
      margin: 0 0 0.5rem;
    }
    .login-header p {
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

    .login-form { display: flex; flex-direction: column; gap: 1.25rem; }
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

    .btn-login {
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
    .btn-login:hover:not(:disabled) { background: #d63851; }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .login-footer p { color: #6b7280; font-size: 0.9rem; margin: 0; }
    .login-footer a { color: #e94560; font-weight: 600; text-decoration: none; }
    .login-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  phone = '';
  password = '';
  submitting = signal(false);
  errorMsg = signal('');

  onLogin(): void {
    this.errorMsg.set('');

    if (!this.phone || !this.password) {
      this.errorMsg.set('Please enter both phone number and password.');
      return;
    }

    this.submitting.set(true);
    const data: LoginRequest = {
      phoneNumber: this.phone,
      password: this.password
    };

    this.auth.login(data).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Login failed. Please check your credentials.');
      },
      complete: () => this.submitting.set(false)
    });
  }
}
