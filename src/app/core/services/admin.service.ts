import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface Restaurant {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    menus: number;
    categories: number;
    dishes: number;
  };
}

export interface CreateRestaurantDto {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  restaurants = signal<Restaurant[]>([]);
  loading = signal(false);

  constructor(private api: ApiService) {}

  loadRestaurants(): Observable<Restaurant[]> {
    this.loading.set(true);
    return this.api.get<Restaurant[]>('/admin/restaurants').pipe(
      tap(restaurants => {
        this.restaurants.set(restaurants);
        this.loading.set(false);
      })
    );
  }

  getRestaurant(id: string): Observable<Restaurant> {
    return this.api.get<Restaurant>(`/admin/restaurants/${id}`);
  }

  createRestaurant(data: CreateRestaurantDto): Observable<Restaurant> {
    return this.api.post<Restaurant>('/admin/restaurants', data).pipe(
      tap(() => this.loadRestaurants().subscribe())
    );
  }

  deleteRestaurant(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/restaurants/${id}`).pipe(
      tap(() => {
        this.restaurants.update(list => list.filter(r => r.id !== id));
      })
    );
  }
}
