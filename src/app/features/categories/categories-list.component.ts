import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService, Menu, MenuCategory } from '../../core/services/menu.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-warm-900">{{ 'categories.title' | translate }}</h2>
          <p class="mt-1 text-warm-500">Gérez les catégories de vos menus</p>
        </div>
        <button
          (click)="openModal()"
          class="inline-flex items-center px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
          </svg>
          {{ 'categories.createCategory' | translate }}
        </button>
      </div>

      <!-- Menu filter -->
      <div class="bg-white rounded-xl border border-cream-200 p-5">
        <label class="block text-sm font-medium text-warm-700 mb-2">Menu</label>
        <select
          [(ngModel)]="selectedMenuId"
          (ngModelChange)="onMenuChange()"
          class="w-full md:w-64 px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
        >
          <option value="">Sélectionner un menu</option>
          @for (menu of menus(); track menu.id) {
            <option [value]="menu.id">{{ menu.title_fr }}</option>
          }
        </select>
      </div>

      @if (!selectedMenuId) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <p class="text-warm-600">Sélectionnez un menu pour voir ses catégories</p>
        </div>
      } @else if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-warm-300 border-t-warm-700"></div>
        </div>
      } @else if (categories().length === 0) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <p class="text-warm-500">{{ 'categories.noCategories' | translate }}</p>
        </div>
      } @else {
        <div class="bg-white rounded-xl border border-cream-200 overflow-hidden">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-cream-100">
                <th class="px-6 py-4 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'categories.sortOrder' | translate }}
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'categories.nameFr' | translate }}
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'categories.nameEn' | translate }}
                </th>
                <th class="px-6 py-4 text-right text-xs font-medium text-warm-500 uppercase tracking-wider">
                  {{ 'common.actions' | translate }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cream-100">
              @for (category of categories(); track category.id) {
                <tr class="hover:bg-cream-50 transition-colors">
                  <td class="px-6 py-4 text-warm-500">{{ category.sortOrder }}</td>
                  <td class="px-6 py-4 font-medium text-warm-900">{{ category.name_fr }}</td>
                  <td class="px-6 py-4 text-warm-500">{{ category.name_en || '-' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end space-x-3">
                      <button
                        (click)="editCategory(category)"
                        class="text-sm text-warm-600 hover:text-warm-800 transition-colors"
                      >
                        {{ 'common.edit' | translate }}
                      </button>
                      <button
                        (click)="deleteCategory(category)"
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

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-warm-900/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div class="px-6 py-5 border-b border-cream-100">
            <h3 class="text-lg font-semibold text-warm-900">
              {{ (editingCategory() ? 'categories.editCategory' : 'categories.createCategory') | translate }}
            </h3>
          </div>
          <form (ngSubmit)="saveCategory()" class="p-6">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">
                  {{ 'categories.nameFr' | translate }} *
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.name_fr"
                  name="name_fr"
                  required
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">
                  {{ 'categories.nameEn' | translate }}
                </label>
                <input
                  type="text"
                  [(ngModel)]="formData.name_en"
                  name="name_en"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">
                  {{ 'categories.sortOrder' | translate }}
                </label>
                <input
                  type="number"
                  [(ngModel)]="formData.sortOrder"
                  name="sortOrder"
                  min="0"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3 pt-5 border-t border-cream-100">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2.5 border border-cream-300 rounded-lg text-sm font-medium text-warm-700 hover:bg-cream-50 transition-colors"
              >
                {{ 'common.cancel' | translate }}
              </button>
              <button
                type="submit"
                class="px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg text-sm font-medium hover:bg-warm-900 transition-colors"
              >
                {{ 'common.save' | translate }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CategoriesListComponent implements OnInit {
  menus = signal<Menu[]>([]);
  categories = signal<MenuCategory[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingCategory = signal<MenuCategory | null>(null);
  selectedMenuId = '';

  formData = {
    name_fr: '',
    name_en: '',
    sortOrder: 0
  };

  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(menus => {
      this.menus.set(menus);
    });
  }

  onMenuChange() {
    if (this.selectedMenuId) {
      this.loadCategories();
    } else {
      this.categories.set([]);
    }
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getAllByMenu(this.selectedMenuId).subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal() {
    if (!this.selectedMenuId) {
      alert('Veuillez d\'abord sélectionner un menu');
      return;
    }
    this.editingCategory.set(null);
    this.formData = { name_fr: '', name_en: '', sortOrder: 0 };
    this.showModal.set(true);
  }

  editCategory(category: MenuCategory) {
    this.editingCategory.set(category);
    this.formData = {
      name_fr: category.name_fr,
      name_en: category.name_en || '',
      sortOrder: category.sortOrder
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveCategory() {
    if (!this.formData.name_fr) return;

    const dto = {
      name_fr: this.formData.name_fr,
      name_en: this.formData.name_en || undefined,
      sortOrder: this.formData.sortOrder
    };

    const editing = this.editingCategory();
    const request = editing
      ? this.categoryService.update(editing.id, dto)
      : this.categoryService.create(this.selectedMenuId, dto);

    request.subscribe(() => {
      this.closeModal();
      this.loadCategories();
    });
  }

  deleteCategory(category: MenuCategory) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categoryService.delete(category.id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
