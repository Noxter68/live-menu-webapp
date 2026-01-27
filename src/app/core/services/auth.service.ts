import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';

export type UserRole = 'admin' | 'restaurant';

export interface User {
  id: string;
  email: string;
  name: string;
  slug?: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'accessToken';
  private roleKey = 'userRole';
  private isLoggingOut = false;

  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
  isLoading = signal(false);

  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isRestaurant = computed(() => this.currentUser()?.role === 'restaurant');

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private checkAuth() {
    const token = this.getToken();
    const role = this.getRole();
    if (token && role) {
      this.isAuthenticated.set(true);
      this.loadCurrentUser();
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.setRole(response.role);
        this.isAuthenticated.set(true);
        this.loadCurrentUser();
      }),
      catchError(error => {
        this.isAuthenticated.set(false);
        return throwError(() => error);
      })
    );
  }

  logout() {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    this.removeToken();
    this.removeRole();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']).then(() => {
      this.isLoggingOut = false;
    });
  }

  clearSession() {
    this.removeToken();
    this.removeRole();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  loadCurrentUser() {
    this.isLoading.set(true);
    this.api.get<User>('/auth/me').subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.setRole(user.role);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    return localStorage.getItem(this.roleKey) as UserRole | null;
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private setRole(role: UserRole) {
    localStorage.setItem(this.roleKey, role);
  }

  private removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  private removeRole() {
    localStorage.removeItem(this.roleKey);
  }
}
