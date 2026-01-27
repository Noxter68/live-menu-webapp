import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MenuCategory } from './menu.service';

export interface CreateCategoryDto {
  name_fr: string;
  name_en?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private api: ApiService) {}

  getAllByMenu(menuId: string): Observable<MenuCategory[]> {
    return this.api.get<MenuCategory[]>(`/menus/${menuId}/categories`);
  }

  getOne(id: string): Observable<MenuCategory> {
    return this.api.get<MenuCategory>(`/categories/${id}`);
  }

  create(menuId: string, dto: CreateCategoryDto): Observable<MenuCategory> {
    return this.api.post<MenuCategory>(`/menus/${menuId}/categories`, dto);
  }

  update(id: string, dto: UpdateCategoryDto): Observable<MenuCategory> {
    return this.api.patch<MenuCategory>(`/categories/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}
