import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
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
            <span class="text-xl font-display font-semibold text-cream-100">LiveMenu</span>
          } @else {
            <span class="text-xl font-display font-semibold text-cream-100">LM</span>
          }
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-3 space-y-1">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-warm-800 text-cream-100"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all group"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">{{ 'nav.dashboard' | translate }}</span>
            }
          </a>

          <a
            routerLink="/dashboard/menus"
            routerLinkActive="bg-warm-800 text-cream-100"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all group"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">{{ 'nav.menus' | translate }}</span>
            }
          </a>

          <a
            routerLink="/dashboard/categories"
            routerLinkActive="bg-warm-800 text-cream-100"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all group"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">{{ 'nav.categories' | translate }}</span>
            }
          </a>

          <a
            routerLink="/dashboard/dishes"
            routerLinkActive="bg-warm-800 text-cream-100"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all group"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">{{ 'nav.dishes' | translate }}</span>
            }
          </a>

          <div class="my-4 border-t border-warm-800"></div>

          <a
            routerLink="/dashboard/preview"
            routerLinkActive="bg-warm-800 text-cream-100"
            class="flex items-center px-3 py-3 rounded-lg text-warm-400 hover:bg-warm-800 hover:text-cream-200 transition-all group"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            @if (!collapsed()) {
              <span class="ml-3 font-medium">{{ 'nav.preview' | translate }}</span>
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
            <h1 class="text-lg font-semibold text-warm-800">
              {{ authService.currentUser()?.name || 'Restaurant' }}
            </h1>
          </div>

          <div class="flex items-center space-x-6">
            <!-- Language switcher -->
            <div class="flex items-center space-x-2">
              <button
                (click)="switchLanguage('fr')"
                [class]="currentLang() === 'fr' ? 'text-warm-800 font-medium' : 'text-warm-400 hover:text-warm-600'"
                class="text-sm transition-colors"
              >
                FR
              </button>
              <span class="text-warm-300">|</span>
              <button
                (click)="switchLanguage('en')"
                [class]="currentLang() === 'en' ? 'text-warm-800 font-medium' : 'text-warm-400 hover:text-warm-600'"
                class="text-sm transition-colors"
              >
                EN
              </button>
            </div>

            <!-- User menu -->
            <button
              (click)="authService.logout()"
              class="flex items-center px-4 py-2 text-sm text-warm-600 hover:text-warm-800 hover:bg-cream-100 rounded-lg transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {{ 'auth.logout' | translate }}
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
export class LayoutComponent {
  collapsed = signal(false);
  currentLang = signal('fr');

  constructor(
    public authService: AuthService,
    private translate: TranslateService
  ) {
    this.currentLang.set(this.translate.currentLang || 'fr');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }
}
