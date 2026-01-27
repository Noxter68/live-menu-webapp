import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Menu {
  id: string;
  title_fr: string;
  title_en?: string;
  description_fr?: string;
  description_en?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  menuId: string;
  name_fr: string;
  name_en?: string;
  sortOrder: number;
  dishes?: Dish[];
}

export interface Dish {
  id: string;
  categoryId: string;
  name_fr: string;
  name_en?: string;
  description_fr?: string;
  description_en?: string;
  ingredients_fr?: string;
  ingredients_en?: string;
  priceCents: number;
  currency: string;
  imageUrl?: string;
  isAvailable: boolean;
  sortOrder: number;
  tags?: DishTag[];
}

export interface DishTag {
  id: string;
  dishId: string;
  tag: string;
}

export interface RestaurantMenuResponse {
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
  menu: Menu;
}

export interface CreateMenuDto {
  title_fr: string;
  title_en?: string;
  description_fr?: string;
  description_en?: string;
  isPublished?: boolean;
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Menu[]> {
    return this.api.get<Menu[]>('/menus');
  }

  getOne(id: string): Observable<Menu> {
    return this.api.get<Menu>(`/menus/${id}`);
  }

  getPublic(id: string): Observable<Menu> {
    return this.api.get<Menu>(`/menus/public/${id}`);
  }

  getBySlug(slug: string): Observable<RestaurantMenuResponse> {
    return this.api.get<RestaurantMenuResponse>(`/menus/r/${slug}`);
  }

  create(dto: CreateMenuDto): Observable<Menu> {
    return this.api.post<Menu>('/menus', dto);
  }

  update(id: string, dto: UpdateMenuDto): Observable<Menu> {
    return this.api.patch<Menu>(`/menus/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/menus/${id}`);
  }
}
