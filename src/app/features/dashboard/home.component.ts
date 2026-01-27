import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService, Menu } from '../../core/services/menu.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-semibold text-warm-900">{{ 'nav.dashboard' | translate }}</h2>
        <p class="mt-1 text-warm-500">Vue d'ensemble de votre restaurant</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-cream-100 rounded-xl">
              <svg class="w-6 h-6 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">{{ 'nav.menus' | translate }}</p>
              <p class="text-2xl font-semibold text-warm-900">{{ menus().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-50 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">{{ 'menus.published' | translate }}</p>
              <p class="text-2xl font-semibold text-warm-900">{{ publishedCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-amber-50 rounded-xl">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">{{ 'menus.notPublished' | translate }}</p>
              <p class="text-2xl font-semibold text-warm-900">{{ menus().length - publishedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-cream-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-cream-100">
          <h3 class="text-lg font-semibold text-warm-900">{{ 'menus.title' | translate }}</h3>
        </div>
        @if (menus().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p class="text-warm-500">{{ 'menus.noMenus' | translate }}</p>
          </div>
        } @else {
          <ul class="divide-y divide-cream-100">
            @for (menu of menus(); track menu.id) {
              <li class="hover:bg-cream-50 transition-colors">
                <a [routerLink]="['/dashboard/menus', menu.id]" class="flex items-center justify-between p-5">
                  <div>
                    <p class="font-medium text-warm-900">{{ menu.title_fr }}</p>
                    @if (menu.description_fr) {
                      <p class="text-sm text-warm-500 mt-0.5">{{ menu.description_fr }}</p>
                    }
                  </div>
                  <span
                    class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full"
                    [class]="menu.isPublished ? 'bg-green-50 text-green-700' : 'bg-warm-100 text-warm-600'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full mr-1.5"
                      [class]="menu.isPublished ? 'bg-green-500' : 'bg-warm-400'"
                    ></span>
                    {{ (menu.isPublished ? 'menus.published' : 'menus.notPublished') | translate }}
                  </span>
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  menus = signal<Menu[]>([]);
  publishedCount = signal(0);

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(menus => {
      this.menus.set(menus);
      this.publishedCount.set(menus.filter(m => m.isPublished).length);
    });
  }
}
