import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private api: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('paisaads_token');
    if (token) {
      this.api.getProfile().pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(() => {
          localStorage.removeItem('paisaads_token');
          return of(null);
        })
      ).subscribe();
    }
  }

  login(data: LoginRequest): Observable<any> {
    return this.api.login(data).pipe(
      tap(response => {
        localStorage.setItem('paisaads_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.api.register(data).pipe(
      tap(response => {
        localStorage.setItem('paisaads_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('paisaads_token');
    this.currentUserSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem('paisaads_token');
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'SUPER_ADMIN' || user?.role === 'EDITOR' || user?.role === 'REVIEWER';
  }
}
