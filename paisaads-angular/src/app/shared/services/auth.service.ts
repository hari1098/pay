import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { ApiService } from './api.service';
import { User, Role } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => {
    const user = this._currentUser();
    return user?.role === Role.SUPER_ADMIN || user?.role === Role.EDITOR || user?.role === Role.REVIEWER;
  });
  readonly isUser = computed(() => this._currentUser()?.role === Role.USER);

  constructor(private api: ApiService) {
    this.loadUser();
  }

  private loadUser(): void {
    this.api.getProfile().pipe(
      tap(user => this._currentUser.set(user)),
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    ).subscribe();
  }

  login(data: { emailOrPhone: string; password: string }): Observable<any> {
    return this.api.login(data).pipe(
      tap((response: any) => {
        this._currentUser.set(response.user);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.api.register(data);
  }

  logout(): Observable<any> {
    return this.api.logout().pipe(
      tap(() => {
        this._currentUser.set(null);
      }),
      catchError(() => {
        this._currentUser.set(null);
        return of(null);
      })
    );
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}
