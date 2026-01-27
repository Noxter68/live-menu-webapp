import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService, Menu } from '../../core/services/menu.service';

@Component({
  selector: 'app-menus-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-warm-900">{{ 'menus.title' | translate }}</h2>
          <p class="mt-1 text-warm-500">Gérez vos cartes et menus</p>
        </div>
        <a
          routerLink="new"
          class="inline-flex items-center px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
          </svg>
          {{ 'menus.createMenu' | translate }}
        </a>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-warm-300 border-t-warm-700"></div>
        </div>
      } @else if (menus().length === 0) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-warm-900">{{ 'menus.noMenus' | translate }}</h3>
          <p class="mt-1 text-warm-500">Commencez par créer votre premier menu</p>
          <a
            routerLink="new"
            class="mt-6 inline-flex items-center px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-900 transition-colors"
          >
            {{ 'menus.createMenu' | translate }}
          </a>
        </div>
      } @else {
        <div class="bg-white rounded-xl border border-cream-200 overflow-hidden">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-cream-100">
                <th class="px-6 py-4 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'menus.titleFr' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'common.actions' | translate }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cream-100">
              @for (menu of menus(); track menu.id) {
                <tr class="hover:bg-cream-50 transition-colors">
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-medium text-warm-900">{{ menu.title_fr }}</p>
                      @if (menu.title_en) {
                        <p class="text-sm text-warm-500">{{ menu.title_en }}</p>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4">
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
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end space-x-3">
                      <a
                        [routerLink]="[menu.id]"
                        class="text-sm text-warm-600 hover:text-warm-800 transition-colors"
                      >
                        {{ 'common.edit' | translate }}
                      </a>
                      <button
                        (click)="deleteMenu(menu)"
                        class="text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        {{ 'common.delete' | translate }}
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class MenusListComponent implements OnInit {
  menus = signal<Menu[]>([]);
  loading = signal(true);

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.loading.set(true);
    this.menuService.getAll().subscribe({
      next: (menus) => {
        this.menus.set(menus);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  deleteMenu(menu: Menu) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      this.menuService.delete(menu.id).subscribe(() => {
        this.loadMenus();
      });
    }
  }
}
