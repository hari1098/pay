import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (isCheckingAuth()) {
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-[#1a1a2e] mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          <p class="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-gray-50">
        <div class="flex justify-between items-center p-4 bg-white shadow-sm">
          <h1 class="text-lg font-semibold text-gray-900">Phone Verification</h1>
          <button class="px-3 py-1 border rounded-md text-sm flex items-center gap-2" (click)="onLogout()">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </div>
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div class="bg-white rounded-lg border shadow-sm p-8 max-w-md w-full">
            <h2 class="text-xl font-semibold mb-4">Verify Your Phone Number</h2>
            <p class="text-gray-600 mb-6">We'll send an OTP to {{ auth.currentUser()?.phone_number || 'your phone number' }}</p>
            @if (!otpSent()) {
              <button (click)="sendOtp()" [disabled]="isSendingOtp()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md disabled:opacity-50">
                {{ isSendingOtp() ? 'Sending...' : 'Send OTP' }}
              </button>
            } @else {
              <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Enter OTP</label>
                  <input type="text" formControlName="otp" placeholder="Enter 6-digit OTP" maxlength="6" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-center tracking-widest" />
                </div>
                <button type="submit" [disabled]="otpForm.invalid || isVerifying()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md disabled:opacity-50">
                  {{ isVerifying() ? 'Verifying...' : 'Verify OTP' }}
                </button>
                <button type="button" (click)="sendOtp()" [disabled]="isSendingOtp()" class="w-full text-sm text-[#1a1a2e] underline">Resend OTP</button>
              </form>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class VerifyOtpComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  isCheckingAuth = signal(true);
  otpSent = signal(false);
  isSendingOtp = signal(false);
  isVerifying = signal(false);

  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.notification.error('Please login first');
      this.router.navigate(['/']);
      return;
    }
    if (this.auth.currentUser()?.phone_verified) {
      this.router.navigate([this.auth.isUser() ? '/dashboard' : '/mgmt/dashboard']);
      return;
    }
    this.isCheckingAuth.set(false);
  }

  sendOtp() {
    const phone = this.auth.currentUser()?.phone_number;
    if (!phone) return;
    this.isSendingOtp.set(true);
    this.api.sendVerificationOtp(phone).subscribe({
      next: () => {
        this.isSendingOtp.set(false);
        this.otpSent.set(true);
        this.notification.success('OTP sent successfully');
      },
      error: () => {
        this.isSendingOtp.set(false);
        this.notification.error('Failed to send OTP');
      },
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;
    const phone = this.auth.currentUser()?.phone_number || '';
    this.isVerifying.set(true);
    this.api.verifyAccount(phone, this.otpForm.value.otp || '').subscribe({
      next: () => {
        this.isVerifying.set(false);
        this.notification.success('Phone number verified successfully!');
        this.router.navigate([this.auth.isUser() ? '/dashboard' : '/mgmt/dashboard']);
      },
      error: () => {
        this.isVerifying.set(false);
        this.notification.error('Invalid OTP');
      },
    });
  }

  onLogout() {
    this.auth.logout().subscribe(() => {
      this.notification.success('Please login again');
      this.router.navigate(['/']);
    });
  }
}
