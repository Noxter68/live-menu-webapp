import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Left side - Branding -->
      <div class="hidden lg:flex lg:w-1/2 bg-cream-100 items-center justify-center p-12">
        <div class="max-w-md text-center">
          <div class="mb-8">
            <span class="text-5xl font-display font-semibold text-warm-800">LiveMenu</span>
          </div>
          <p class="text-warm-600 text-lg leading-relaxed">
            La solution élégante pour gérer vos menus de restaurant.
            Simple, moderne et efficace.
          </p>
          <div class="mt-12 flex justify-center space-x-8">
            <div class="text-center">
              <div class="text-3xl font-semibold text-warm-700">500+</div>
              <div class="text-sm text-warm-500 mt-1">Restaurants</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-semibold text-warm-700">10k+</div>
              <div class="text-sm text-warm-500 mt-1">Menus créés</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-semibold text-warm-700">98%</div>
              <div class="text-sm text-warm-500 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Login Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream-50">
        <div class="w-full max-w-md">
          <!-- Mobile logo -->
          <div class="lg:hidden text-center mb-10">
            <span class="text-3xl font-display font-semibold text-warm-800">LiveMenu</span>
          </div>

          <div class="mb-10">
            <h1 class="text-2xl font-semibold text-warm-900">
              {{ 'auth.loginTitle' | translate }}
            </h1>
            <p class="mt-2 text-warm-500">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-6">
            @if (error()) {
              <div class="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                {{ 'auth.invalidCredentials' | translate }}
              </div>
            }

            <div class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-warm-700 mb-2">
                  {{ 'auth.email' | translate }}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  [(ngModel)]="email"
                  class="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-warm-700 mb-2">
                  {{ 'auth.password' | translate }}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  [(ngModel)]="password"
                  class="w-full px-4 py-3 bg-white border border-cream-300 rounded-lg text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-warm-800 text-cream-50 font-medium rounded-lg hover:bg-warm-900 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:ring-offset-2 focus:ring-offset-cream-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              @if (loading()) {
                <span class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              } @else {
                {{ 'auth.loginButton' | translate }}
              }
            </button>
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm text-warm-400">
              Besoin d'aide ? <a href="#" class="text-warm-600 hover:text-warm-800 underline">Contactez-nous</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.error.set('auth.invalidCredentials');
        this.loading.set(false);
      }
    });
  }
}
