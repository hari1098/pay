import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { CategoryTree, SearchSlogan } from '../../shared/models/models';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="pt-20 flex flex-col items-center justify-center px-4">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-8">{{ sloganData()?.primarySlogan || 'Find What You Need' }}</h1>
        <p class="text-lg md:text-xl text-gray-600 mb-12">{{ sloganData()?.secondarySlogan || 'Search through thousands of classified advertisements' }}</p>
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-5xl mx-auto">
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <select [(ngModel)]="categoryId" name="categoryId" class="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="">Select category</option>
                @for (cat of flatCategories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
              <input type="text" [(ngModel)]="stateName" name="state" placeholder="Select State" class="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" />
              <input type="text" [(ngModel)]="cityName" name="city" placeholder="Select City" class="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" />
              <input type="text" [(ngModel)]="countryName" name="country" placeholder="Select Country" class="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" />
              <button type="submit" class="h-10 px-6 bg-[#1a1a2e] text-white rounded-md">
                <svg class="mr-2 h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  imports: [FormsModule],
})
export class SearchComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  categories = signal<CategoryTree[]>([]);
  flatCategories = signal<{id: string; name: string}[]>([]);
  sloganData = signal<SearchSlogan | null>(null);
  categoryId = '';
  stateName = '';
  cityName = '';
  countryName = '';

  ngOnInit() {
    this.api.getCategoryTree().subscribe(data => {
      this.categories.set(data);
      this.flatCategories.set(this.api.flattenCategories(data));
    });
    this.api.getSearchSlogan().subscribe(data => this.sloganData.set(data));
  }

  onSubmit() {
    const params = new URLSearchParams();
    if (this.categoryId) params.append('categoryId', this.categoryId);
    if (this.stateName) params.append('state', this.stateName);
    if (this.cityName) params.append('city', this.cityName);
    this.router.navigate(['/search/results'], { queryParams: { categoryId: this.categoryId || undefined, state: this.stateName || undefined, city: this.cityName || undefined } });
  }
}
