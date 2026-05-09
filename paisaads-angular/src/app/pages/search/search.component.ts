import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { CategoryService } from '../../services/category.service';
import { ConfigService } from '../../services/config.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-search',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatIcon],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly configService = inject(ConfigService);

  readonly categories = signal<Category[]>([]);
  readonly slogan = signal('Find the best deals near you');

  mainCategory = '';
  state = '';
  city = '';

  ngOnInit(): void {
    this.categoryService.getCategoriesTree().subscribe({
      next: (res) => this.categories.set(res.mainCategories ?? []),
      error: () => {},
    });
    this.configService.getSearchSlogan().subscribe({
      next: (res) => this.slogan.set(res.slogan),
      error: () => {},
    });
  }

  onSearch(): void {
    const queryParams: Record<string, string> = {};
    if (this.mainCategory) queryParams['mainCategory'] = this.mainCategory;
    if (this.state) queryParams['state'] = this.state;
    if (this.city) queryParams['city'] = this.city;

    this.router.navigate(['/search/results'], { queryParams });
  }

  navigateToCategory(catSlug: string): void {
    this.router.navigate(['/search/results'], { queryParams: { mainCategory: catSlug } });
  }
}
