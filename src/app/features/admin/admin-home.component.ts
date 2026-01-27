import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-warm-900">Dashboard</h1>
        <p class="mt-1 text-warm-500">Vue d'ensemble de votre plateforme</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-cream-100">
              <svg class="h-6 w-6 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">Total Restaurants</p>
              <p class="text-2xl font-semibold text-warm-900">{{ adminService.restaurants().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-cream-100">
              <svg class="h-6 w-6 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">Menus actifs</p>
              <p class="text-2xl font-semibold text-warm-900">{{ getTotalMenus() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-cream-200 p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-cream-100">
              <svg class="h-6 w-6 text-warm-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-warm-500">Plats créés</p>
              <p class="text-2xl font-semibold text-warm-900">{{ getTotalDishes() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-cream-200 p-6">
        <h2 class="text-lg font-medium text-warm-900 mb-4">Actions rapides</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            routerLink="/admin/restaurants"
            class="flex items-center px-4 py-3 text-warm-700 hover:bg-cream-50 rounded-lg transition-colors group"
          >
            <svg class="w-5 h-5 mr-3 text-warm-400 group-hover:text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            <span>Voir tous les restaurants</span>
          </a>
          <a
            routerLink="/admin/restaurants/new"
            class="flex items-center px-4 py-3 text-warm-700 hover:bg-cream-50 rounded-lg transition-colors group"
          >
            <svg class="w-5 h-5 mr-3 text-warm-400 group-hover:text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Créer un nouveau restaurant</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminHomeComponent implements OnInit {
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.adminService.loadRestaurants().subscribe();
  }

  getTotalMenus(): number {
    return this.adminService.restaurants().reduce((acc, r) => acc + r._count.menus, 0);
  }

  getTotalDishes(): number {
    return this.adminService.restaurants().reduce((acc, r) => acc + r._count.dishes, 0);
  }
}
