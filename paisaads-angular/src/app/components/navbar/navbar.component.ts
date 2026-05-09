import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  template: `
    <header class="w-full sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <div class="flex-shrink-0">
            <a routerLink="/" class="flex items-center">
              <img src="/logo.png" alt="PaisaAds - Broadcast Brilliance" class="h-10 w-auto" />
            </a>
          </div>

          <nav class="hidden md:flex items-center justify-center flex-1">
            <div class="flex items-center space-x-8">
              @for (item of navItems; track item.href) {
                <a
                  [routerLink]="item.href"
                  routerLinkActive="text-white bg-[#1a1a2e] shadow-lg"
                  [routerLinkActiveOptions]="{exact: item.href === '/'}"
                  class="text-sm font-semibold transition-all duration-200 px-2 py-1 rounded-lg text-gray-700 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/5 hover:shadow-sm"
                >
                  {{ item.label }}
                </a>
              }
            </div>
          </nav>

          <div class="md:hidden">
            <button
              class="p-2 rounded-md hover:bg-gray-100"
              (click)="toggleMobileMenu()"
            >
              @if (isMobileMenuOpen()) {
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              } @else {
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>

          <div class="hidden md:flex items-center gap-3 flex-shrink-0">
            @if (auth.isLoggedIn()) {
              <div class="relative">
                <button
                  class="flex items-center gap-2 px-2 py-1 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50"
                  (click)="toggleDropdown()"
                >
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1a2e]/10 text-[#1a1a2e] font-bold text-base">
                    {{ getInitials(auth.currentUser()?.name) }}
                  </span>
                  <span class="hidden md:inline">{{ auth.currentUser()?.name || 'My Account' }}</span>
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                @if (isDropdownOpen()) {
                  <div class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border p-2 z-50">
                    <a [routerLink]="auth.isUser() ? '/dashboard' : '/mgmt/dashboard'" class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100" (click)="isDropdownOpen.set(false)">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/></svg>
                      Dashboard
                    </a>
                    <a [routerLink]="auth.isUser() ? '/dashboard/profile' : '/mgmt/dashboard/profile'" class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100" (click)="isDropdownOpen.set(false)">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      Profile Settings
                    </a>
                    <hr class="my-1">
                    <button class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-500 w-full" (click)="handleLogout()">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Logout
                    </button>
                  </div>
                }
              </div>
            } @else {
              <button class="rounded-full px-4 font-semibold shadow-md border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10 transition-colors" (click)="isViewAdOpen.set(true)">View Ads</button>
              <button class="rounded-full px-4 font-semibold shadow-md border-2 border-[#1a1a2e] text-white bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 transition-colors" (click)="isLoginOpen.set(true)">Post Ad</button>
            }
          </div>
        </div>

        @if (isMobileMenuOpen()) {
          <div class="md:hidden border-t bg-white/95 backdrop-blur">
            <div class="px-4 py-4 space-y-2">
              <div class="space-y-1">
                @for (item of navItems; track item.href) {
                  <a [routerLink]="item.href" (click)="isMobileMenuOpen.set(false)" routerLinkActive="text-white bg-[#1a1a2e] shadow-lg" [routerLinkActiveOptions]="{exact: item.href === '/'}" class="block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 text-gray-700 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/5">{{ item.label }}</a>
                }
              </div>
              <div class="pt-4 border-t space-y-2">
                @if (auth.isLoggedIn()) {
                  <a [routerLink]="auth.isUser() ? '/dashboard' : '/mgmt/dashboard'" (click)="isMobileMenuOpen.set(false)" class="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1a1a2e]/5 text-[#1a1a2e] font-semibold">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/></svg>
                    Dashboard
                  </a>
                  <button class="w-full justify-start gap-2 px-4 py-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-sm" (click)="handleLogout(); isMobileMenuOpen.set(false)">
                    <svg class="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Logout
                  </button>
                } @else {
                  <button class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm" (click)="isViewAdOpen.set(true); isMobileMenuOpen.set(false)">View Ads</button>
                  <button class="w-full px-4 py-2 bg-[#1a1a2e] text-white rounded-md text-sm" (click)="isLoginOpen.set(true); isMobileMenuOpen.set(false)">Post Ad</button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </header>

    <!-- Login Dialog -->
    @if (isLoginOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" (click)="isLoginOpen.set(false)"></div>
        <div class="relative bg-white rounded-lg shadow-lg max-w-[425px] w-full mx-4 p-6 z-10">
          <button class="absolute top-4 right-4" (click)="isLoginOpen.set(false)">&times;</button>
          <h2 class="text-lg font-semibold mb-4">Login to Post an Advertisement</h2>
          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Email or Phone</label>
              <input type="text" formControlName="emailOrPhone" placeholder="Enter email or phone" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input type="password" formControlName="password" placeholder="Enter password" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" [disabled]="loginForm.invalid || isLoginLoading()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
              {{ isLoginLoading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          <div class="mt-4 text-center">
            <span class="text-sm text-gray-500">Don't have an account? </span>
            <button class="text-sm text-[#1a1a2e] underline" (click)="isLoginOpen.set(false); router.navigate(['/register'])">Create an account</button>
          </div>
        </div>
      </div>
    }

    <!-- View Ad Dialog -->
    @if (isViewAdOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" (click)="isViewAdOpen.set(false)"></div>
        <div class="relative bg-white rounded-lg shadow-lg max-w-[425px] w-full mx-4 p-6 z-10">
          <button class="absolute top-4 right-4" (click)="isViewAdOpen.set(false)">&times;</button>
          <h2 class="text-lg font-semibold mb-4">View Advertisements</h2>
          <form [formGroup]="viewAdForm" (ngSubmit)="onViewAdSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" formControlName="phoneNumber" placeholder="Enter your phone number" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" [disabled]="viewAdForm.invalid" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">View Ads</button>
          </form>
        </div>
      </div>
    }
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  router = inject(Router);
  private notification = inject(NotificationService);
  private api = inject(ApiService);

  isMobileMenuOpen = signal(false);
  isDropdownOpen = signal(false);
  isLoginOpen = signal(false);
  isViewAdOpen = signal(false);
  isLoginLoading = signal(false);

  navItems = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ];

  loginForm = new FormGroup({
    emailOrPhone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  viewAdForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  toggleMobileMenu() { this.isMobileMenuOpen.update(v => !v); }
  toggleDropdown() { this.isDropdownOpen.update(v => !v); }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoginLoading.set(true);
    this.api.login(this.loginForm.value as { emailOrPhone: string; password: string }).subscribe({
      next: (response: any) => {
        this.isLoginLoading.set(false);
        this.isLoginOpen.set(false);
        this.notification.success('Login successful');
        if (response.user && !response.user.phone_verified) {
          this.router.navigate(['/verify-otp']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoginLoading.set(false);
        this.notification.error('Login failed', 'Invalid email or password');
      },
    });
  }

  onViewAdSubmit(): void {
    if (this.viewAdForm.invalid) return;
    this.isViewAdOpen.set(false);
    this.router.navigate(['/search']);
  }

  handleLogout(): void {
    this.auth.logout().subscribe(() => {
      this.notification.success('Logged out successfully');
      this.router.navigate(['/']);
    });
  }
}
