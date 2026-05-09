import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-categories',
  imports: [MatTableModule, MatIcon, MatProgressSpinner],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['name', 'slug', 'children'];

  ngOnInit(): void {
    this.categoryService.getCategoriesTree().subscribe({
      next: (res) => {
        this.categories.set(res.mainCategories ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
