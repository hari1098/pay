import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoggedIn = signal(!!localStorage.getItem('auth_token'));

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');

  constructor() {
    super();
    if (this._isLoggedIn()) {
      this.getProfile().subscribe({
        next: (user) => this._currentUser.set(user),
        error: () => this.logout(),
      });
    }
  }

  login(phone: string, password: string) {
    const payload: LoginRequest = { phoneNumber: phone, password };
    return this.post<AuthResponse>('/auth/login', payload);
  }

  register(data: RegisterRequest) {
    return this.post<AuthResponse>('/auth/register', data);
  }

  getProfile() {
    return this.get<User>('/auth/profile');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    this._currentUser.set(response.user);
    this._isLoggedIn.set(true);
  }
}
