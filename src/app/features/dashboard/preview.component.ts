import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService, Menu } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-dashboard-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-warm-900">{{ 'nav.preview' | translate }}</h2>
          <p class="mt-1 text-warm-500">Prévisualisez vos menus comme vos clients les verront</p>
        </div>
      </div>

      <!-- Menu selector and device toggle -->
      <div class="bg-white rounded-xl border border-cream-200 p-5">
        <div class="flex flex-wrap items-end gap-4">
          <div class="min-w-[250px]">
            <label class="block text-sm font-medium text-warm-700 mb-2">Menu à prévisualiser</label>
            <select
              [(ngModel)]="selectedMenuId"
              (ngModelChange)="onMenuChange()"
              class="w-full px-4 py-2.5 bg-white border border-cream-300 rounded-lg text-warm-900 focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent"
            >
              <option value="">Sélectionner un menu</option>
              @for (menu of menus(); track menu.id) {
                <option [value]="menu.id">
                  {{ menu.title_fr }}
                  {{ menu.isPublished ? '' : '(non publié)' }}
                </option>
              }
            </select>
          </div>

          <!-- Device toggle -->
          <div class="flex items-center gap-2 bg-cream-100 p-1 rounded-lg">
            <button
              (click)="deviceMode.set('mobile')"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              [class]="deviceMode() === 'mobile' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'"
            >
              <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Mobile
            </button>
            <button
              (click)="deviceMode.set('tablet')"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              [class]="deviceMode() === 'tablet' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'"
            >
              <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Tablette
            </button>
            <button
              (click)="deviceMode.set('desktop')"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              [class]="deviceMode() === 'desktop' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'"
            >
              <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Desktop
            </button>
          </div>

          @if (selectedMenuId && selectedMenu()) {
            <a
              [href]="getPublicUrl()"
              target="_blank"
              class="inline-flex items-center px-4 py-2.5 border border-cream-300 text-warm-700 rounded-lg hover:bg-cream-50 transition-colors ml-auto"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Ouvrir dans un nouvel onglet
            </a>
          }
        </div>
      </div>

      @if (!selectedMenuId) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <p class="text-warm-600">Sélectionnez un menu pour le prévisualiser</p>
        </div>
      } @else {
        <!-- Preview frame -->
        <div class="flex justify-center">
          <div
            class="bg-warm-800 rounded-3xl p-3 shadow-2xl transition-all duration-300"
            [class]="getDeviceFrameClasses()"
          >
            <!-- Device notch (for mobile) -->
            @if (deviceMode() === 'mobile') {
              <div class="w-24 h-6 bg-warm-900 rounded-full mx-auto mb-2"></div>
            }

            <!-- Iframe container -->
            <div
              class="bg-white rounded-2xl overflow-hidden"
              [class]="getDeviceScreenClasses()"
            >
              @if (previewUrl()) {
                <iframe
                  [src]="previewUrl()"
                  class="w-full h-full border-0"
                  title="Menu preview"
                ></iframe>
              }
            </div>

            <!-- Device home button (for mobile/tablet) -->
            @if (deviceMode() === 'mobile' || deviceMode() === 'tablet') {
              <div class="w-12 h-12 bg-warm-700 rounded-full mx-auto mt-3"></div>
            }
          </div>
        </div>

        <!-- Public URL and QR Code -->
        @if (restaurantSlug()) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- URL Section -->
            <div class="bg-white rounded-xl border border-cream-200 p-5">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-warm-900 mb-1">URL publique de votre menu</p>
                  <p class="text-sm text-warm-500 mb-3">Partagez cette URL avec vos clients</p>
                  <div class="flex items-center gap-2">
                    <code class="flex-1 px-3 py-2 bg-cream-50 rounded-lg text-sm text-warm-700 font-mono truncate">
                      {{ getFullPublicUrl() }}
                    </code>
                    <button
                      (click)="copyUrl()"
                      class="px-4 py-2 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-700 transition-colors flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      @if (copied()) {
                        Copié !
                      } @else {
                        Copier
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- QR Code Section -->
            <div class="bg-white rounded-xl border border-cream-200 p-5">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-warm-900 mb-1">QR Code</p>
                  <p class="text-sm text-warm-500 mb-4">Imprimez ce QR code pour vos tables</p>

                  <div class="flex flex-col items-center">
                    @if (qrCodeDataUrl()) {
                      <div class="bg-white p-4 rounded-xl border-2 border-cream-200 mb-4">
                        <img [src]="qrCodeDataUrl()" alt="QR Code menu" class="w-40 h-40" />
                      </div>
                      <button
                        (click)="downloadQrCode()"
                        class="inline-flex items-center px-4 py-2 bg-warm-800 text-cream-50 rounded-lg hover:bg-warm-700 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Télécharger PNG
                      </button>
                    } @else {
                      <div class="w-40 h-40 bg-cream-100 rounded-xl flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-2 border-warm-300 border-t-warm-700"></div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Status info -->
        @if (selectedMenu() && !selectedMenu()!.isPublished) {
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="font-medium text-amber-800">Menu non publié</p>
              <p class="text-sm text-amber-600 mt-1">
                Ce menu n'est pas encore visible par vos clients. Publiez-le depuis la page Menus pour le rendre accessible.
              </p>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class PreviewComponent implements OnInit {
  menus = signal<Menu[]>([]);
  selectedMenu = signal<Menu | null>(null);
  selectedMenuId = '';
  deviceMode = signal<'mobile' | 'tablet' | 'desktop'>('mobile');
  previewUrl = signal<SafeResourceUrl | null>(null);
  copied = signal(false);
  qrCodeDataUrl = signal<string | null>(null);

  restaurantSlug = computed(() => this.authService.currentUser()?.slug);

  constructor(
    private menuService: MenuService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    // Generate QR code when slug is available
    effect(() => {
      const slug = this.restaurantSlug();
      if (slug) {
        this.generateQrCode();
      }
    });
  }

  ngOnInit() {
    this.menuService.getAll().subscribe(menus => {
      this.menus.set(menus);
    });
  }

  onMenuChange() {
    if (this.selectedMenuId) {
      const menu = this.menus().find(m => m.id === this.selectedMenuId);
      this.selectedMenu.set(menu || null);
      this.updatePreviewUrl();
    } else {
      this.selectedMenu.set(null);
      this.previewUrl.set(null);
    }
  }

  updatePreviewUrl() {
    if (this.selectedMenuId) {
      const url = `/preview/${this.selectedMenuId}?mode=owner`;
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }
  }

  getPublicUrl(): string {
    const slug = this.restaurantSlug();
    return slug ? `/r/${slug}` : `/preview/${this.selectedMenuId}`;
  }

  getFullPublicUrl(): string {
    const slug = this.restaurantSlug();
    const baseUrl = window.location.origin;
    return slug ? `${baseUrl}/r/${slug}` : `${baseUrl}/preview/${this.selectedMenuId}`;
  }

  copyUrl() {
    navigator.clipboard.writeText(this.getFullPublicUrl()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  async generateQrCode() {
    const url = this.getFullPublicUrl();
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#44403c', // warm-700
          light: '#ffffff'
        }
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }

  downloadQrCode() {
    const dataUrl = this.qrCodeDataUrl();
    if (!dataUrl) return;

    const slug = this.restaurantSlug() || 'menu';
    const link = document.createElement('a');
    link.download = `qr-code-${slug}.png`;
    link.href = dataUrl;
    link.click();
  }

  getDeviceFrameClasses(): string {
    switch (this.deviceMode()) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
        return 'w-full max-w-[1024px]';
      default:
        return '';
    }
  }

  getDeviceScreenClasses(): string {
    switch (this.deviceMode()) {
      case 'mobile':
        return 'h-[667px]';
      case 'tablet':
        return 'h-[600px]';
      case 'desktop':
        return 'h-[600px]';
      default:
        return '';
    }
  }
}
