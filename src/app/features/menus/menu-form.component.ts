import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService, Menu, CreateMenuDto } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-warm-900">
            {{ (isEdit() ? 'menus.editMenu' : 'menus.createMenu') | translate }}
          </h2>
          <p class="mt-1 text-warm-500">{{ isEdit() ? 'Modifiez les informations du menu' : 'Créez un nouveau menu pour votre restaurant' }}</p>
        </div>
        <a
          routerLink="/dashboard/menus"
          class="text-warm-600 hover:text-warm-800 transition-colors"
        >
          {{ 'common.back' | translate }}
        </a>
      </div>

      <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl border border-cream-200 p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-warm-700 mb-2">
              {{ 'menus.titleFr' | translate }} *
            </label>
            <input
              type="text"
              [(ngModel)]="form.title_fr"
              name="title_fr"
              required
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-warm-700 mb-2">
              {{ 'menus.titleEn' | translate }}
            </label>
            <input
              type="text"
              [(ngModel)]="form.title_en"
              name="title_en"
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-warm-700 mb-2">
              {{ 'menus.descriptionFr' | translate }}
            </label>
            <textarea
              [(ngModel)]="form.description_fr"
              name="description_fr"
              rows="3"
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-warm-700 mb-2">
              {{ 'menus.descriptionEn' | translate }}
            </label>
            <textarea
              [(ngModel)]="form.description_en"
              name="description_en"
              rows="3"
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <div
          (click)="form.isPublished = !form.isPublished"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all"
          [class]="form.isPublished
            ? 'border-green-200 bg-green-50/50'
            : 'border-cream-200 bg-cream-50/50 hover:border-cream-300'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                [class]="form.isPublished ? 'bg-green-100' : 'bg-cream-200'"
              >
                <svg
                  class="w-5 h-5 transition-colors"
                  [class]="form.isPublished ? 'text-green-600' : 'text-warm-400'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  @if (form.isPublished) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  }
                </svg>
              </div>
              <div>
                <p class="font-medium text-warm-900">{{ 'menus.published' | translate }}</p>
                <p class="text-xs text-warm-500">
                  {{ form.isPublished ? 'Le menu est visible par les clients' : 'Le menu est masqué' }}
                </p>
              </div>
            </div>
            <div
              class="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              [class]="form.isPublished ? 'bg-green-500' : 'bg-warm-300'"
            >
              <div
                class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                [style.left]="form.isPublished ? '22px' : '4px'"
              ></div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-5 border-t border-cream-100">
          <a
            routerLink="/dashboard/menus"
            class="px-4 py-2.5 border border-cream-300 rounded-lg text-sm font-medium text-warm-700 hover:bg-cream-50 transition-colors"
          >
            {{ 'common.cancel' | translate }}
          </a>
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
  `
})
export class MenuFormComponent implements OnInit {
  isEdit = signal(false);
  saving = signal(false);
  menuId: string | null = null;

  form: CreateMenuDto & { isPublished: boolean } = {
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    isPublished: false
  };

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuId = this.route.snapshot.paramMap.get('id');
    if (this.menuId && this.menuId !== 'new') {
      this.isEdit.set(true);
      this.loadMenu();
    }
  }

  loadMenu() {
    if (!this.menuId) return;

    this.menuService.getOne(this.menuId).subscribe((menu) => {
      this.form = {
        title_fr: menu.title_fr,
        title_en: menu.title_en || '',
        description_fr: menu.description_fr || '',
        description_en: menu.description_en || '',
        isPublished: menu.isPublished
      };
    });
  }

  onSubmit() {
    if (!this.form.title_fr) return;

    this.saving.set(true);

    const dto: CreateMenuDto = {
      title_fr: this.form.title_fr,
      title_en: this.form.title_en || undefined,
      description_fr: this.form.description_fr || undefined,
      description_en: this.form.description_en || undefined,
      isPublished: this.form.isPublished
    };

    const request = this.isEdit()
      ? this.menuService.update(this.menuId!, dto)
      : this.menuService.create(dto);

    request.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/menus']);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
