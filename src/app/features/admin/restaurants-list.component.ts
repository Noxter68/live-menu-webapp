import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, Restaurant } from '../../core/services/admin.service';

@Component({
  selector: 'app-restaurants-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-semibold text-warm-900">Restaurants</h1>
          <p class="mt-1 text-warm-500">Gérez les comptes restaurants de la plateforme</p>
        </div>
        <a
          routerLink="/admin/restaurants/new"
          class="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-cream-50 bg-warm-800 hover:bg-warm-900 transition-colors"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau restaurant
        </a>
      </div>

      @if (adminService.loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-warm-300 border-t-warm-700"></div>
        </div>
      } @else if (adminService.restaurants().length === 0) {
        <div class="bg-white rounded-xl border border-cream-200 p-12 text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-warm-900">Aucun restaurant</h3>
          <p class="mt-1 text-warm-500">Commencez par créer un nouveau restaurant.</p>
          <div class="mt-6">
            <a
              routerLink="/admin/restaurants/new"
              class="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-cream-50 bg-warm-800 hover:bg-warm-900 transition-colors"
            >
              Créer un restaurant
            </a>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-xl border border-cream-200 overflow-hidden">
          <ul class="divide-y divide-cream-100">
            @for (restaurant of adminService.restaurants(); track restaurant.id) {
              <li class="hover:bg-cream-50 transition-colors">
                <div class="px-6 py-5 flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3">
                      <h3 class="text-base font-medium text-warm-900 truncate">{{ restaurant.name }}</h3>
                      <div class="flex space-x-2">
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-cream-100 text-warm-700">
                          {{ restaurant._count.menus }} menus
                        </span>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-cream-100 text-warm-700">
                          {{ restaurant._count.dishes }} plats
                        </span>
                      </div>
                    </div>
                    <div class="mt-2 flex items-center space-x-4 text-sm text-warm-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {{ restaurant.email }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {{ restaurant.createdAt | date:'dd/MM/yyyy' }}
                      </span>
                    </div>
                  </div>
                  <button
                    (click)="deleteRestaurant(restaurant)"
                    class="ml-4 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `
})
export class RestaurantsListComponent implements OnInit {
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.adminService.loadRestaurants().subscribe();
  }

  deleteRestaurant(restaurant: Restaurant) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le restaurant "${restaurant.name}" ? Cette action est irréversible.`)) {
      this.adminService.deleteRestaurant(restaurant.id).subscribe();
    }
  }
}
