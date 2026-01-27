import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService, Menu, MenuCategory, Dish } from '../../core/services/menu.service';

@Component({
  selector: 'app-menu-preview',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-cream-50">
      @if (loading()) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-warm-300 border-t-warm-700"></div>
        </div>
      } @else if (error()) {
        <div class="flex flex-col items-center justify-center min-h-screen px-4">
          <div class="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-semibold text-warm-900 mb-2">Menu introuvable</h1>
          <p class="text-warm-500">Ce menu n'existe pas ou n'est pas disponible.</p>
        </div>
      } @else if (menu()) {
        <!-- Menu Title Section (Menu du Jour) with Language Toggle -->
        <section #menuTitleSection class="bg-white border-b border-cream-200">
          <div class="max-w-4xl mx-auto px-4 py-6 md:py-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-xl md:text-3xl font-bold text-warm-900">
                  {{ currentLang() === 'en' && menu()!.title_en ? menu()!.title_en : menu()!.title_fr }}
                </h1>
                @if (menuDescription()) {
                  <p class="text-warm-500 mt-2 text-sm md:text-base">{{ menuDescription() }}</p>
                }
              </div>
              <!-- Language toggle -->
              <button
                (click)="toggleLanguage()"
                class="p-2 rounded-lg border border-cream-200 hover:bg-cream-50 transition-colors flex-shrink-0"
                title="Changer la langue"
              >
                <span class="text-sm font-medium text-warm-700">
                  {{ currentLang() === 'fr' ? 'EN' : 'FR' }}
                </span>
              </button>
            </div>
          </div>
        </section>

        <!-- Navigation categories - becomes sticky after scrolling past menu title -->
        <nav
          #categoryNav
          class="bg-white border-b border-cream-200 z-40 transition-shadow"
          [class.sticky]="isCategoryNavSticky()"
          [class.top-0]="isCategoryNavSticky()"
          [class.shadow-md]="isCategoryNavSticky()"
        >
          <div class="max-w-4xl mx-auto px-4">
            <div class="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
              <button
                (click)="filterCategory(null)"
                class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
                [class]="!selectedCategory()
                  ? 'bg-warm-800 text-cream-50'
                  : 'text-warm-600 hover:bg-cream-100'"
              >
                Tout
              </button>
              @for (category of sortedCategories(); track category.id) {
                <button
                  (click)="filterCategory(category.id)"
                  class="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
                  [class]="selectedCategory() === category.id
                    ? 'bg-warm-800 text-cream-50'
                    : 'text-warm-600 hover:bg-cream-100'"
                >
                  {{ currentLang() === 'en' && category.name_en ? category.name_en : category.name_fr }}
                </button>
              }
            </div>
          </div>
        </nav>

        <!-- Menu content -->
        <main class="max-w-4xl mx-auto px-4 py-6 md:py-8">
          @for (category of displayedCategories(); track category.id) {
            <section
              [id]="'category-' + category.id"
              class="mb-10 md:mb-12 scroll-mt-14 animate-fade-in"
            >
              <!-- Category title -->
              <div class="mb-4 md:mb-6">
                <h2 class="text-lg md:text-2xl font-bold text-warm-900">
                  {{ currentLang() === 'en' && category.name_en ? category.name_en : category.name_fr }}
                </h2>
                <div class="h-1 w-12 md:w-16 bg-warm-800 mt-2 rounded-full"></div>
              </div>

              <!-- Dishes -->
              <div class="space-y-3 md:space-y-4">
                @for (dish of getAvailableDishes(category); track dish.id) {
                  <button
                    (click)="openDishModal(dish)"
                    class="w-full text-left bg-white rounded-xl border border-cream-200 overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99]"
                    [class.opacity-60]="!dish.isAvailable"
                  >
                    <div class="flex">
                      <!-- Image -->
                      @if (dish.imageUrl) {
                        <div class="w-24 h-24 md:w-40 md:h-40 flex-shrink-0">
                          <img
                            [src]="dish.imageUrl"
                            [alt]="getDishName(dish)"
                            class="w-full h-full object-cover"
                          />
                        </div>
                      }

                      <!-- Content -->
                      <div class="flex-1 p-3 md:p-5 flex flex-col justify-between min-w-0">
                        <div>
                          <div class="flex items-start justify-between gap-2">
                            <h3 class="font-semibold text-warm-900 text-base md:text-lg truncate">
                              {{ getDishName(dish) }}
                            </h3>
                            <span class="text-base md:text-lg font-bold text-warm-800 whitespace-nowrap flex-shrink-0">
                              {{ (dish.priceCents / 100).toFixed(2) }}€
                            </span>
                          </div>

                          @if (getDishDescription(dish)) {
                            <p class="text-warm-500 text-xs md:text-sm mt-1 md:mt-2 line-clamp-2">
                              {{ getDishDescription(dish) }}
                            </p>
                          }

                          @if (getDishIngredients(dish)) {
                            <p class="text-warm-400 text-[10px] md:text-xs mt-1 italic line-clamp-2">
                              {{ getDishIngredients(dish) }}
                            </p>
                          }
                        </div>

                        <!-- Tags -->
                        @if (dish.tags && dish.tags.length > 0) {
                          <div class="flex flex-wrap gap-1 mt-2 md:mt-3">
                            @for (tag of dish.tags.slice(0, 3); track tag.id) {
                              <span
                                class="inline-flex items-center px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full"
                                [class]="getTagClasses(tag.tag)"
                              >
                                {{ getTagIcon(tag.tag) }}
                              </span>
                            }
                            @if (dish.tags.length > 3) {
                              <span class="text-[10px] md:text-xs text-warm-400">+{{ dish.tags.length - 3 }}</span>
                            }
                          </div>
                        }

                        @if (!dish.isAvailable) {
                          <span class="inline-flex items-center mt-2 px-2 py-0.5 text-[10px] md:text-xs font-medium bg-warm-100 text-warm-500 rounded-full w-fit">
                            Indisponible
                          </span>
                        }
                      </div>
                    </div>
                  </button>
                } @empty {
                  <div class="text-center py-8 text-warm-400">
                    Aucun plat dans cette catégorie
                  </div>
                }
              </div>
            </section>
          }
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-cream-200 py-6 md:py-8">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <p class="text-xs md:text-sm text-warm-400">
              Propulsé par LiveMenu
            </p>
          </div>
        </footer>
      }

      <!-- Dish Detail Modal -->
      @if (selectedDish()) {
        <div
          class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-warm-900/30 backdrop-blur-sm animate-modal-overlay"
          (click)="closeDishModal()"
        >
          <div
            class="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-modal-slide"
            (click)="$event.stopPropagation()"
          >
            <!-- Image -->
            @if (selectedDish()!.imageUrl) {
              <div class="relative w-full aspect-[16/10] overflow-hidden">
                <img
                  [src]="selectedDish()!.imageUrl"
                  [alt]="getDishName(selectedDish()!)"
                  class="w-full h-full object-cover"
                />
                <!-- Close button on image -->
                <button
                  (click)="closeDishModal()"
                  class="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                >
                  <svg class="w-5 h-5 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }

            <!-- Content -->
            <div class="p-5 md:p-6 max-h-[60vh] overflow-y-auto">
              <!-- Close button when no image -->
              @if (!selectedDish()!.imageUrl) {
                <div class="flex justify-end mb-2">
                  <button
                    (click)="closeDishModal()"
                    class="w-9 h-9 hover:bg-cream-100 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg class="w-5 h-5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Title and price -->
              <div class="flex items-start justify-between gap-4">
                <h3 class="text-xl md:text-2xl font-bold text-warm-900 leading-tight">
                  {{ getDishName(selectedDish()!) }}
                </h3>
                <span class="text-lg md:text-xl font-bold text-warm-800 whitespace-nowrap bg-cream-50 px-3 py-1 rounded-xl">
                  {{ (selectedDish()!.priceCents / 100).toFixed(2) }}€
                </span>
              </div>

              <!-- Description -->
              @if (getDishDescription(selectedDish()!)) {
                <p class="text-warm-600 text-sm md:text-base leading-relaxed mt-3">
                  {{ getDishDescription(selectedDish()!) }}
                </p>
              }

              <!-- Ingredients -->
              @if (getDishIngredients(selectedDish()!)) {
                <div class="mt-4 p-3 bg-cream-50 rounded-xl">
                  <p class="text-[11px] font-semibold text-warm-400 uppercase tracking-wider mb-1">Ingrédients</p>
                  <p class="text-warm-600 text-sm leading-relaxed">{{ getDishIngredients(selectedDish()!) }}</p>
                </div>
              }

              <!-- Tags -->
              @if (selectedDish()!.tags && selectedDish()!.tags!.length > 0) {
                <div class="flex flex-wrap gap-2 mt-4">
                  @for (tag of selectedDish()!.tags; track tag.id) {
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full"
                      [class]="getTagClasses(tag.tag)"
                    >
                      <span>{{ getTagIcon(tag.tag) }}</span>
                      <span>{{ 'tags.' + tag.tag | translate }}</span>
                    </span>
                  }
                </div>
              }

              <!-- Availability -->
              @if (!selectedDish()!.isAvailable) {
                <div class="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-3">
                  <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                  </svg>
                  <span class="text-sm font-medium text-red-600">Ce plat est actuellement indisponible</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .scroll-mt-14 {
      scroll-margin-top: 3.5rem;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeInUp 0.35s ease-out both;
    }

    @keyframes modalOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-modal-overlay {
      animation: modalOverlay 0.2s ease-out both;
    }

    @keyframes modalSlide {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-modal-slide {
      animation: modalSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* Hide scrollbar but keep functionality */
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class MenuPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('menuTitleSection') menuTitleSection!: ElementRef<HTMLElement>;

  menu = signal<Menu | null>(null);
  restaurantName = signal<string>('');
  loading = signal(true);
  error = signal(false);
  currentLang = signal<'fr' | 'en'>('fr');
  activeCategory = signal<string>('');
  selectedDish = signal<Dish | null>(null);
  selectedCategory = signal<string | null>(null);
  isCategoryNavSticky = signal(false);
  isOwnerMode = false;

  private scrollHandler: (() => void) | null = null;

  sortedCategories = computed(() => {
    const m = this.menu();
    if (!m?.categories) return [];
    return [...m.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  displayedCategories = computed(() => {
    const selected = this.selectedCategory();
    const all = this.sortedCategories();
    if (!selected) return all;
    return all.filter(c => c.id === selected);
  });

  menuDescription = computed(() => {
    const m = this.menu();
    if (!m) return '';
    return this.currentLang() === 'en' && m.description_en ? m.description_en : m.description_fr;
  });

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const menuId = this.route.snapshot.paramMap.get('id');
    const slug = this.route.snapshot.paramMap.get('slug');
    this.isOwnerMode = this.route.snapshot.queryParamMap.get('mode') === 'owner';

    if (slug) {
      this.loadMenuBySlug(slug);
    } else if (menuId) {
      this.loadMenu(menuId);
    } else {
      this.error.set(true);
      this.loading.set(false);
    }

    // Set up intersection observer for category navigation
    if (typeof IntersectionObserver !== 'undefined') {
      setTimeout(() => this.setupIntersectionObserver(), 500);
    }

    // Set up scroll handler for sticky category nav
    this.setupScrollHandler();
  }

  ngOnDestroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      document.removeEventListener('scroll', this.scrollHandler);
    }
  }

  setupScrollHandler() {
    this.scrollHandler = () => {
      if (this.menuTitleSection?.nativeElement) {
        const titleSection = this.menuTitleSection.nativeElement;
        const titleRect = titleSection.getBoundingClientRect();
        // When the bottom of the menu title section reaches the top of the viewport, make nav sticky
        this.isCategoryNavSticky.set(titleRect.bottom <= 0);
      }
    };

    // Listen on both window and document for iframe compatibility
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    document.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  loadMenuBySlug(slug: string) {
    this.menuService.getBySlug(slug).subscribe({
      next: response => {
        this.menu.set(response.menu);
        this.restaurantName.set(response.restaurant.name);
        const cats = this.sortedCategories();
        if (cats.length > 0) {
          this.activeCategory.set(cats[0].id);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  loadMenu(id: string) {
    // Use authenticated route if owner mode, otherwise public route
    const request = this.isOwnerMode
      ? this.menuService.getOne(id)
      : this.menuService.getPublic(id);

    request.subscribe({
      next: menu => {
        this.menu.set(menu);
        const cats = this.sortedCategories();
        if (cats.length > 0) {
          this.activeCategory.set(cats[0].id);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-56px 0px -70% 0px', // 56px = height of sticky nav
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('category-', '');
          this.activeCategory.set(id);
        }
      });
    }, options);

    this.sortedCategories().forEach(cat => {
      const element = document.getElementById('category-' + cat.id);
      if (element) {
        observer.observe(element);
      }
    });
  }

  toggleLanguage() {
    this.currentLang.set(this.currentLang() === 'fr' ? 'en' : 'fr');
  }

  filterCategory(categoryId: string | null) {
    this.selectedCategory.set(categoryId);
    // Scroll back to top of menu content
    if (categoryId) {
      setTimeout(() => {
        const element = document.getElementById('category-' + categoryId);
        if (element) {
          const navHeight = 48;
          const elementRect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({ top: scrollTop + elementRect.top - navHeight, behavior: 'smooth' });
        }
      });
    }
  }

  scrollToCategory(categoryId: string) {
    const element = document.getElementById('category-' + categoryId);
    if (element) {
      // Calculate nav height dynamically for precise positioning
      const navHeight = 48; // height of the sticky category nav
      const elementRect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = scrollTop + elementRect.top - navHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }

  openDishModal(dish: Dish) {
    this.selectedDish.set(dish);
    document.body.style.overflow = 'hidden';
  }

  closeDishModal() {
    this.selectedDish.set(null);
    document.body.style.overflow = '';
  }

  getAvailableDishes(category: MenuCategory): Dish[] {
    if (!category.dishes) return [];
    return [...category.dishes].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getDishName(dish: Dish): string {
    return this.currentLang() === 'en' && dish.name_en ? dish.name_en : dish.name_fr;
  }

  getDishIngredients(dish: Dish): string {
    if (this.currentLang() === 'en' && dish.ingredients_en) {
      return dish.ingredients_en;
    }
    return dish.ingredients_fr || '';
  }

  getDishDescription(dish: Dish): string {
    if (this.currentLang() === 'en' && dish.description_en) {
      return dish.description_en;
    }
    return dish.description_fr || '';
  }

  getTagClasses(tag: string): string {
    const tagColors: Record<string, string> = {
      'vegetarian': 'bg-green-50 text-green-700',
      'vegan': 'bg-green-50 text-green-700',
      'gluten_free': 'bg-amber-50 text-amber-700',
      'spicy': 'bg-red-50 text-red-700',
      'signature': 'bg-purple-50 text-purple-700',
      'new': 'bg-blue-50 text-blue-700',
      'halal': 'bg-emerald-50 text-emerald-700',
      'kosher': 'bg-emerald-50 text-emerald-700',
      'contains_nuts': 'bg-orange-50 text-orange-700',
      'contains_dairy': 'bg-yellow-50 text-yellow-700',
    };
    return tagColors[tag] || 'bg-cream-100 text-warm-600';
  }

  getTagIcon(tag: string): string {
    const tagIcons: Record<string, string> = {
      'vegetarian': '🥬',
      'vegan': '🌱',
      'gluten_free': '🌾',
      'spicy': '🌶️',
      'signature': '⭐',
      'new': '✨',
      'halal': '',
      'kosher': '',
      'contains_nuts': '🥜',
      'contains_dairy': '🥛',
    };
    return tagIcons[tag] || '';
  }
}
