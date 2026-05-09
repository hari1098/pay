import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Category, CategoryTree } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService extends ApiService {

  getCategoriesTree() {
    return this.get<CategoryTree>('/categories/tree');
  }

  getCategories() {
    return this.get<Category[]>('/categories');
  }
}
