import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl">
      <div class="mb-8">
        <a routerLink="/admin/restaurants" class="inline-flex items-center text-sm text-warm-500 hover:text-warm-700 transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
          </svg>
          Retour aux restaurants
        </a>
      </div>

      <div class="bg-white rounded-xl border border-cream-200">
        <div class="px-6 py-5 border-b border-cream-100">
          <h2 class="text-lg font-semibold text-warm-900">Créer un nouveau restaurant</h2>
          <p class="mt-1 text-sm text-warm-500">Remplissez les informations pour créer un compte restaurant</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-warm-700 mb-2">
              Nom du restaurant
            </label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="form.name"
              required
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-all"
              placeholder="Le Petit Bistro"
              (ngModelChange)="onNameChange($event)"
            />
            @if (slugPreview()) {
              <p class="mt-1.5 text-sm text-warm-400">
                Slug : <span class="font-mono text-warm-600">{{ slugPreview() }}</span>
              </p>
            }
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-warm-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="form.email"
              required
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-all"
              placeholder="contact@restaurant.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-warm-700 mb-2">
              Mot de passe
            </label>
            <div class="flex">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="form.password"
                required
                minlength="8"
                class="flex-1 px-4 py-2.5 bg-white border border-cream-300 rounded-l-lg text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent transition-all"
                placeholder="Minimum 8 caractères"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="px-4 border border-l-0 border-cream-300 bg-cream-50 text-warm-500 rounded-r-lg hover:bg-cream-100 transition-colors"
              >
                @if (showPassword()) {
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                } @else {
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                }
              </button>
            </div>
            <button
              type="button"
              (click)="generatePassword()"
              class="mt-2 text-sm text-warm-600 hover:text-warm-800 transition-colors"
            >
              Générer un mot de passe sécurisé
            </button>
          </div>

          @if (error()) {
            <div class="rounded-lg bg-red-50 border border-red-100 p-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-red-700">{{ error() }}</p>
              </div>
            </div>
          }

          <div class="flex justify-end space-x-3 pt-4">
            <a
              routerLink="/admin/restaurants"
              class="px-4 py-2.5 border border-cream-300 rounded-lg text-sm font-medium text-warm-700 bg-white hover:bg-cream-50 transition-colors"
            >
              Annuler
            </a>
            <button
              type="submit"
              [disabled]="loading()"
              class="px-4 py-2.5 rounded-lg text-sm font-medium text-cream-50 bg-warm-800 hover:bg-warm-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (loading()) {
                <span class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </span>
              } @else {
                Créer le restaurant
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RestaurantFormComponent {
  form = {
    name: '',
    email: '',
    password: ''
  };

  slugPreview = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  onNameChange(name: string) {
    this.slugPreview.set(
      name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    );
  }

  generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.form.password = password;
    this.showPassword.set(true);
  }

  onSubmit() {
    if (!this.form.name || !this.form.email || !this.form.password) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.form.password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.adminService.createRestaurant(this.form).subscribe({
      next: () => {
        this.router.navigate(['/admin/restaurants']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Une erreur est survenue lors de la création.');
      }
    });
  }
}
