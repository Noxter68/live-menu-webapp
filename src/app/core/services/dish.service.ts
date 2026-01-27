import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dish } from './menu.service';

export interface CreateDishDto {
  name_fr: string;
  name_en?: string;
  description_fr?: string;
  description_en?: string;
  ingredients_fr?: string;
  ingredients_en?: string;
  priceCents: number;
  currency?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  sortOrder?: number;
  tags?: string[];
}

export interface UpdateDishDto extends Partial<CreateDishDto> {}

@Injectable({
  providedIn: 'root'
})
export class DishService {
  constructor(private api: ApiService) {}

  getAllByCategory(categoryId: string): Observable<Dish[]> {
    return this.api.get<Dish[]>(`/categories/${categoryId}/dishes`);
  }

  getOne(id: string): Observable<Dish> {
    return this.api.get<Dish>(`/dishes/${id}`);
  }

  create(categoryId: string, dto: CreateDishDto): Observable<Dish> {
    return this.api.post<Dish>(`/categories/${categoryId}/dishes`, dto);
  }

  update(id: string, dto: UpdateDishDto): Observable<Dish> {
    return this.api.patch<Dish>(`/dishes/${id}`, dto);
  }

  updateTags(id: string, tags: string[]): Observable<Dish> {
    return this.api.put<Dish>(`/dishes/${id}/tags`, { tags });
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/dishes/${id}`);
  }
}
