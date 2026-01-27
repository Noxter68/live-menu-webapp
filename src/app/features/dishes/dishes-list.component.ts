import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuService, Menu, MenuCategory, Dish } from '../../core/services/menu.service';
import { CategoryService } from '../../core/services/category.service';
import { DishService, CreateDishDto } from '../../core/services/dish.service';
import { UploadService } from '../../core/services/upload.service';
import { TagService } from '../../core/services/tag.service';

@Component({
  selector: 'app-dishes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, DragDropModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-warm-900">{{ 'dishes.title' | translate }}</h2>
          <p class="mt-1 text-warm-500">Gérez les plats de vos menus</p>
        </div>
        <button
          (click)="openModal()"
          class="inline-flex items-center px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
          </svg>
          {{ 'dishes.createDish' | translate }}
        </button>
      </div>

      <!-- Menu filter -->
      <div class="bg-white rounded-xl border border-cream-200 p-5">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="min-w-[250px]">
            <label class="block text-sm font-medium text-warm-700 mb-2">Menu</label>
            <select
              [(ngModel)]="selectedMenuId"
              (ngModelChange)="onMenuChange()"
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
            >
              <option value="">Sélectionner un menu</option>
              @for (menu of menus(); track menu.id) {
                <option [value]="menu.id">{{ menu.title_fr }}</option>
              }
            </select>
          </div>
          @if (selectedMenu()) {
            <a
              [routerLink]="['/preview', selectedMenu()!.id]"
              target="_blank"
              class="inline-flex items-center px-4 py-2.5 border border-cream-300 text-warm-700 rounded-lg hover:bg-cream-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Prévisualiser
            </a>
          }
        </div>
      </div>

      @if (!selectedMenuId) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <p class="text-warm-600">Sélectionnez un menu pour voir et organiser les plats</p>
        </div>
      } @else if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-warm-300 border-t-warm-700"></div>
        </div>
      } @else {
        <!-- Categories with dishes -->
        @for (category of sortedCategories(); track category.id; let catIdx = $index) {
          <div class="bg-white rounded-xl border border-cream-200 overflow-hidden">
            <!-- Category header -->
            <div class="px-6 py-4 bg-cream-50 border-b border-cream-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 flex items-center justify-center bg-warm-800 text-cream-50 text-sm font-semibold rounded-lg">
                    {{ catIdx + 1 }}
                  </span>
                  <h3 class="text-lg font-semibold text-warm-900">{{ category.name_fr }}</h3>
                  @if (category.name_en) {
                    <span class="text-warm-400">/ {{ category.name_en }}</span>
                  }
                </div>
                <span class="text-sm text-warm-500">
                  {{ category.dishes?.length || 0 }} plat{{ (category.dishes?.length || 0) > 1 ? 's' : '' }}
                </span>
              </div>
            </div>

            <!-- Dishes table -->
            @if (category.dishes && category.dishes.length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b border-cream-100 bg-cream-50/50">
                      <th class="w-10 px-3 py-3"></th>
                      <th class="w-16 px-3 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">Image</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">Nom</th>
                      <th class="w-20 px-3 py-3 text-center text-xs font-medium text-warm-500 uppercase tracking-wider">Ordre</th>
                      <th class="w-24 px-3 py-3 text-right text-xs font-medium text-warm-500 uppercase tracking-wider">Prix</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-warm-500 uppercase tracking-wider">Tags</th>
                      <th class="w-24 px-3 py-3 text-center text-xs font-medium text-warm-500 uppercase tracking-wider">Statut</th>
                      <th class="w-24 px-4 py-3 text-right text-xs font-medium text-warm-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    cdkDropList
                    [cdkDropListData]="category.dishes"
                    (cdkDropListDropped)="onDrop($event, category)"
                    class="divide-y divide-cream-100"
                  >
                    @for (dish of category.dishes; track dish.id) {
                      <tr
                        cdkDrag
                        [cdkDragData]="dish"
                        class="hover:bg-cream-50 transition-colors group"
                      >
                        <!-- Drag handle -->
                        <td class="px-3 py-3 text-center">
                          <div cdkDragHandle class="cursor-grab active:cursor-grabbing p-1 text-warm-400 hover:text-warm-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8h16M4 16h16"/>
                            </svg>
                          </div>
                        </td>
                        <!-- Image -->
                        <td class="px-3 py-2">
                          @if (dish.imageUrl) {
                            <img [src]="dish.imageUrl" [alt]="dish.name_fr" class="w-12 h-12 rounded-lg object-cover"/>
                          } @else {
                            <div class="w-12 h-12 rounded-lg bg-cream-100 flex items-center justify-center">
                              <svg class="w-5 h-5 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          }
                        </td>
                        <!-- Name -->
                        <td class="px-4 py-3">
                          <div class="font-medium text-warm-900">{{ dish.name_fr }}</div>
                          @if (dish.description_fr) {
                            <div class="text-xs text-warm-500 mt-0.5 line-clamp-1">{{ dish.description_fr }}</div>
                          }
                        </td>
                        <!-- Sort order -->
                        <td class="px-3 py-3 text-center">
                          <span class="text-sm text-warm-500">{{ dish.sortOrder }}</span>
                        </td>
                        <!-- Price -->
                        <td class="px-3 py-3 text-right">
                          <span class="font-semibold text-warm-800">{{ (dish.priceCents / 100).toFixed(2) }}€</span>
                        </td>
                        <!-- Tags -->
                        <td class="px-4 py-3">
                          <div class="flex flex-wrap gap-1">
                            @for (tag of dish.tags; track tag.id) {
                              <span class="px-2 py-0.5 text-xs bg-cream-100 text-warm-600 rounded-full">
                                {{ 'tags.' + tag.tag | translate }}
                              </span>
                            }
                          </div>
                        </td>
                        <!-- Status -->
                        <td class="px-3 py-3 text-center">
                          <button
                            (click)="toggleAvailability(dish, category)"
                            class="inline-flex items-center"
                          >
                            <span
                              class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                              [class]="dish.isAvailable ? 'bg-green-50 text-green-700' : 'bg-warm-100 text-warm-500'"
                            >
                              <span
                                class="w-1.5 h-1.5 rounded-full mr-1.5"
                                [class]="dish.isAvailable ? 'bg-green-500' : 'bg-warm-400'"
                              ></span>
                              {{ dish.isAvailable ? 'Dispo' : 'Indispo' }}
                            </span>
                          </button>
                        </td>
                        <!-- Actions -->
                        <td class="px-4 py-3 text-right">
                          <div class="flex items-center justify-end space-x-1">
                            <button
                              (click)="editDish(dish, category.id)"
                              class="p-1.5 text-warm-500 hover:text-warm-700 hover:bg-cream-100 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                            </button>
                            <button
                              (click)="deleteDish(dish)"
                              class="p-1.5 text-warm-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <div class="p-8 text-center text-warm-500">
                Aucun plat dans cette catégorie
              </div>
            }
          </div>
        }

        @if (sortedCategories().length === 0) {
          <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
            <p class="text-warm-500">Ce menu n'a pas encore de catégories</p>
            <a
              routerLink="/dashboard/categories"
              class="inline-flex items-center mt-4 text-warm-700 hover:text-warm-900"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
              </svg>
              Créer une catégorie
            </a>
          </div>
        }
      }
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-warm-900/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-5 border-b border-cream-100 sticky top-0 bg-white z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-warm-900">
                {{ (editingDish() ? 'dishes.editDish' : 'dishes.createDish') | translate }}
              </h3>
              <button type="button" (click)="closeModal()" class="p-2 text-warm-400 hover:text-warm-600 hover:bg-cream-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <form (ngSubmit)="saveDish()" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Sélection Menu/Catégorie -->
              @if (!editingDish()) {
                <div>
                  <label class="block text-sm font-medium text-warm-700 mb-2">Menu *</label>
                  <select
                    [(ngModel)]="modalMenuId"
                    (ngModelChange)="onModalMenuChange()"
                    name="modalMenu"
                    required
                    class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                  >
                    <option value="">Sélectionner un menu</option>
                    @for (menu of menus(); track menu.id) {
                      <option [value]="menu.id">{{ menu.title_fr }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'nav.categories' | translate }} *</label>
                  <select
                    [(ngModel)]="modalCategoryId"
                    name="modalCategory"
                    required
                    [disabled]="!modalMenuId"
                    class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent disabled:bg-cream-50 disabled:text-warm-400"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    @for (cat of modalCategories(); track cat.id) {
                      <option [value]="cat.id">{{ cat.name_fr }}</option>
                    }
                  </select>
                </div>
              }
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'dishes.nameFr' | translate }} *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name_fr"
                  name="name_fr"
                  required
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'dishes.nameEn' | translate }}</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name_en"
                  name="name_en"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'dishes.descriptionFr' | translate }}</label>
                <textarea
                  [(ngModel)]="formData.description_fr"
                  name="description_fr"
                  rows="2"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'dishes.descriptionEn' | translate }}</label>
                <textarea
                  [(ngModel)]="formData.description_en"
                  name="description_en"
                  rows="2"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">Ingrédients (FR)</label>
                <textarea
                  [(ngModel)]="formData.ingredients_fr"
                  name="ingredients_fr"
                  rows="2"
                  placeholder="Ex: Salade romaine, parmesan, croûtons, sauce César"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">Ingredients (EN)</label>
                <textarea
                  [(ngModel)]="formData.ingredients_en"
                  name="ingredients_en"
                  rows="2"
                  placeholder="Ex: Romaine lettuce, parmesan, croutons, Caesar dressing"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'dishes.price' | translate }} (EUR) *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.priceEuros"
                  name="price"
                  step="0.01"
                  min="0"
                  required
                  (focus)="onPriceFocus($event)"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-2">{{ 'categories.sortOrder' | translate }}</label>
                <input
                  type="number"
                  [(ngModel)]="formData.sortOrder"
                  name="sortOrder"
                  min="0"
                  class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-warm-700 mb-3">{{ 'dishes.image' | translate }}</label>
                <div class="space-y-4">
                  <!-- Preview en grand au-dessus -->
                  @if (imagePreview() || formData.imageUrl) {
                    <div class="relative group">
                      <img
                        [src]="imagePreview() || formData.imageUrl"
                        class="w-full h-48 rounded-xl object-cover border border-cream-200"
                      />
                      <button
                        type="button"
                        (click)="clearImage()"
                        class="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  }
                  <!-- Upload zone -->
                  <label class="block cursor-pointer">
                    <div
                      class="px-6 py-5 border-2 border-dashed rounded-xl transition-colors text-center"
                      [class]="imagePreview() || formData.imageUrl ? 'border-cream-200 hover:border-cream-300' : 'border-cream-300 hover:border-warm-400 bg-cream-50/50'"
                    >
                      <div class="flex flex-col items-center gap-2">
                        <div class="p-3 bg-cream-100 rounded-xl">
                          <svg class="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-warm-700">
                            @if (imagePreview() || formData.imageUrl) {
                              Changer l'image
                            } @else {
                              Choisir une image
                            }
                          </p>
                          <p class="text-xs text-warm-400 mt-0.5">JPG, PNG ou WebP</p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      (change)="onFileSelect($event)"
                      accept="image/jpeg,image/png,image/webp"
                      class="hidden"
                    />
                  </label>
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-warm-700 mb-3">{{ 'dishes.tags' | translate }}</label>
                <div class="flex flex-wrap gap-2">
                  @for (tag of availableTags(); track tag) {
                    <button
                      type="button"
                      (click)="toggleTag(tag)"
                      class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
                      [class]="formData.tags.includes(tag)
                        ? 'bg-warm-800 text-cream-50 border-warm-800'
                        : 'bg-white text-warm-600 border-cream-300 hover:border-warm-400'"
                    >
                      {{ 'tags.' + tag | translate }}
                    </button>
                  }
                </div>
              </div>
              <div class="md:col-span-2">
                <button
                  type="button"
                  (click)="formData.isAvailable = !formData.isAvailable"
                  class="flex items-center gap-3"
                >
                  <div
                    class="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                    [class]="formData.isAvailable ? 'bg-green-500' : 'bg-warm-300'"
                  >
                    <div
                      class="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200"
                      [style.left]="formData.isAvailable ? '18px' : '4px'"
                    ></div>
                  </div>
                  <span class="text-sm text-warm-700">{{ 'dishes.available' | translate }}</span>
                </button>
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
                [disabled]="saving()"
                class="px-4 py-2.5 bg-warm-800 text-cream-50 rounded-lg text-sm font-medium hover:bg-warm-900 disabled:opacity-50 transition-colors"
              >
                @if (saving()) {
                  <span class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                } @else {
                  {{ 'common.save' | translate }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
      background: white;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class DishesListComponent implements OnInit {
  menus = signal<Menu[]>([]);
  selectedMenu = signal<Menu | null>(null);
  availableTags = signal<string[]>([]);
  loading = signal(false);
  saving = signal(false);
  showModal = signal(false);
  editingDish = signal<Dish | null>(null);
  editingCategoryId = signal<string | null>(null);
  modalCategories = signal<MenuCategory[]>([]);

  selectedMenuId = '';
  modalMenuId = '';
  modalCategoryId = '';
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  sortedCategories = computed(() => {
    const menu = this.selectedMenu();
    if (!menu?.categories) return [];
    return [...menu.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  formData = {
    name_fr: '',
    name_en: '',
    description_fr: '',
    description_en: '',
    ingredients_fr: '',
    ingredients_en: '',
    priceEuros: 0,
    imageUrl: '',
    isAvailable: true,
    sortOrder: 0,
    tags: [] as string[]
  };

  constructor(
    private menuService: MenuService,
    private categoryService: CategoryService,
    private dishService: DishService,
    private uploadService: UploadService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.menuService.getAll().subscribe(m => this.menus.set(m));
    this.tagService.getAll().subscribe(t => this.availableTags.set(t));
  }

  onMenuChange() {
    if (this.selectedMenuId) {
      this.loadMenu();
    } else {
      this.selectedMenu.set(null);
    }
  }

  loadMenu() {
    this.loading.set(true);
    this.menuService.getOne(this.selectedMenuId).subscribe({
      next: menu => {
        this.selectedMenu.set(menu);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onModalMenuChange() {
    this.modalCategoryId = '';
    this.modalCategories.set([]);
    if (this.modalMenuId) {
      this.categoryService.getAllByMenu(this.modalMenuId).subscribe(c => this.modalCategories.set(c));
    }
  }

  onDrop(event: CdkDragDrop<Dish[]>, category: MenuCategory) {
    if (event.previousIndex !== event.currentIndex && category.dishes) {
      moveItemInArray(category.dishes, event.previousIndex, event.currentIndex);

      // Update sortOrder for all dishes in the category
      category.dishes.forEach((dish, index) => {
        if (dish.sortOrder !== index) {
          dish.sortOrder = index;
          this.dishService.update(dish.id, { sortOrder: index }).subscribe();
        }
      });
    }
  }

  openModal() {
    this.editingDish.set(null);
    this.editingCategoryId.set(null);
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.modalMenuId = this.selectedMenuId || '';
    this.modalCategoryId = '';
    if (this.modalMenuId) {
      this.categoryService.getAllByMenu(this.modalMenuId).subscribe(c => this.modalCategories.set(c));
    } else {
      this.modalCategories.set([]);
    }
    this.formData = { name_fr: '', name_en: '', description_fr: '', description_en: '', ingredients_fr: '', ingredients_en: '', priceEuros: 0, imageUrl: '', isAvailable: true, sortOrder: 0, tags: [] };
    this.showModal.set(true);
  }

  editDish(dish: Dish, categoryId: string) {
    this.editingDish.set(dish);
    this.editingCategoryId.set(categoryId);
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.formData = {
      name_fr: dish.name_fr,
      name_en: dish.name_en || '',
      description_fr: dish.description_fr || '',
      description_en: dish.description_en || '',
      ingredients_fr: dish.ingredients_fr || '',
      ingredients_en: dish.ingredients_en || '',
      priceEuros: dish.priceCents / 100,
      imageUrl: dish.imageUrl || '',
      isAvailable: dish.isAvailable,
      sortOrder: dish.sortOrder,
      tags: dish.tags?.map(t => t.tag) || []
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.formData.imageUrl = '';
  }

  toggleTag(tag: string) {
    const idx = this.formData.tags.indexOf(tag);
    if (idx > -1) {
      this.formData.tags.splice(idx, 1);
    } else {
      this.formData.tags.push(tag);
    }
  }

  toggleAvailability(dish: Dish, category: MenuCategory) {
    const dto: CreateDishDto = {
      name_fr: dish.name_fr,
      name_en: dish.name_en || undefined,
      description_fr: dish.description_fr || undefined,
      description_en: dish.description_en || undefined,
      priceCents: dish.priceCents,
      imageUrl: dish.imageUrl || undefined,
      isAvailable: !dish.isAvailable,
      sortOrder: dish.sortOrder,
      tags: dish.tags?.map(t => t.tag) || []
    };
    this.dishService.update(dish.id, dto).subscribe(() => {
      // Update locally without reload
      dish.isAvailable = !dish.isAvailable;
    });
  }

  async saveDish() {
    const editing = this.editingDish();
    const categoryId = editing ? this.editingCategoryId() : this.modalCategoryId;

    if (!this.formData.name_fr || this.formData.priceEuros < 0) return;
    if (!editing && !categoryId) {
      alert('Sélectionnez un menu et une catégorie');
      return;
    }
    this.saving.set(true);

    let imageUrl = this.formData.imageUrl;
    if (this.selectedFile) {
      try {
        imageUrl = await this.uploadService.uploadFile(this.selectedFile, 'dish').toPromise() || '';
      } catch {
        this.saving.set(false);
        return;
      }
    }

    const dto: CreateDishDto = {
      name_fr: this.formData.name_fr,
      name_en: this.formData.name_en || undefined,
      description_fr: this.formData.description_fr || undefined,
      description_en: this.formData.description_en || undefined,
      ingredients_fr: this.formData.ingredients_fr || undefined,
      ingredients_en: this.formData.ingredients_en || undefined,
      priceCents: Math.round(this.formData.priceEuros * 100),
      imageUrl: imageUrl || undefined,
      isAvailable: this.formData.isAvailable,
      sortOrder: this.formData.sortOrder,
      tags: this.formData.tags
    };

    const req = editing
      ? this.dishService.update(editing.id, dto)
      : this.dishService.create(categoryId!, dto);

    req.subscribe({
      next: () => {
        this.closeModal();
        this.loadMenu();
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  onPriceFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (this.formData.priceEuros === 0) {
      input.select();
    }
  }

  deleteDish(dish: Dish) {
    if (confirm('Supprimer ce plat ?')) {
      this.dishService.delete(dish.id).subscribe(() => this.loadMenu());
    }
  }
}
