import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Role } from '../../../shared/models/models';

@Component({
  selector: 'app-mgmt-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md space-y-8">
        <div class="flex flex-col items-center space-y-2 text-center">
          <h1 class="text-2xl font-bold tracking-tight">Management Login</h1>
          <p class="text-sm text-gray-500">Enter your credentials to access the management dashboard</p>
        </div>
        <div class="rounded-lg border bg-white p-8 shadow-sm">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 pt-4">
            <div>
              <label class="block text-sm font-medium mb-1">Email or Phone</label>
              <input type="text" formControlName="emailOrPhone" placeholder="Enter email or phone" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input type="password" formControlName="password" placeholder="Enter password" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
              {{ isLoading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class MgmtLoginComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private auth = inject(AuthService);
  isLoading = signal(false);

  loginForm = new FormGroup({
    emailOrPhone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.api.login(this.loginForm.value as { emailOrPhone: string; password: string }).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        if (response.user && [Role.EDITOR, Role.REVIEWER, Role.SUPER_ADMIN].includes(response.user.role)) {
          this.notification.success('Login successful', 'Welcome to the management dashboard');
          if (response.user && !response.user.phone_verified) {
            this.router.navigate(['/verify-otp']);
          } else {
            this.router.navigate(['/mgmt/dashboard']);
          }
        } else {
          this.notification.error('Access denied', 'You do not have management privileges');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.notification.error('Login failed', 'Invalid email or password. Please try again.');
      },
    });
  }
}
