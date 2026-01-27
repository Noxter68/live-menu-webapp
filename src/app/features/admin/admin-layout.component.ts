import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <div class="min-h-screen bg-cream-50">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 bg-warm-900 transition-all duration-300"
        [class.w-64]="!collapsed()"
        [class.w-20]="collapsed()"
      >
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-warm-800">
          @if (!collapsed()) {
            <div class="flex items-center">
              <span class="text-xl font-display font-semibold text-cream-100">LiveMenu</span>
              <span class="ml-2 px-2 py-0.5 text-xs bg-cream-600 text-cream-50 rounded font-medium">Admin</span>
            </div>
          } @else {
            <span class="text-xl font-display font-semibold text-cream-100">LM</span>
          }
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-3 space-y-1">
          <a
            routerLink="/admin"
            routerLinkActive="bg-warm-800 text-cream-100"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">Dashboard</span>
            }
          </a>

          <a
            routerLink="/admin/restaurants"
            routerLinkActive="bg-warm-800 text-cream-100"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">Restaurants</span>
            }
          </a>
        </nav>

        <!-- Collapse button -->
        <div class="absolute bottom-6 left-0 right-0 px-3">
          <button
            (click)="collapsed.set(!collapsed())"
            class="w-full flex items-center justify-center px-3 py-2 rounded-lg text-warm-500 hover:bg-warm-800 hover:text-cream-200 transition-all"
          >
            @if (collapsed()) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 5l7 7-7 7"/>
              </svg>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19l-7-7 7-7"/>
              </svg>
            }
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div
        class="transition-all duration-300"
        [class.ml-64]="!collapsed()"
        [class.ml-20]="collapsed()"
      >
        <!-- Topbar -->
        <header class="h-16 bg-white border-b border-cream-200 flex items-center justify-between px-8">
          <div>
            <h1 class="text-lg font-semibold text-warm-800">Administration</h1>
          </div>

          <div class="flex items-center space-x-6">
            <span class="text-sm text-warm-500">{{ authService.currentUser()?.name }}</span>
            <button
              (click)="authService.logout()"
              class="flex items-center px-4 py-2 text-sm text-warm-600 hover:text-warm-800 hover:bg-cream-100 rounded-lg transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </header>

        <!-- Page content -->
        <main class="p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  collapsed = signal(false);

  constructor(public authService: AuthService) {}
}
