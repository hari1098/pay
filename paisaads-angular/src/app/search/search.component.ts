import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { Category, SearchSlogan } from '../shared/models/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Search Hero -->
    <section class="search-hero">
      @if (slogan()) {
        <h1 class="search-title">{{ slogan()?.primarySlogan || 'Search Classified Ads' }}</h1>
        <p class="search-subtitle">{{ slogan()?.secondarySlogan || 'Find what you need across India' }}</p>
      } @else {
        <h1 class="search-title">Search Classified Ads</h1>
        <p class="search-subtitle">Find what you need across India</p>
      }
    </section>

    <!-- Search Form -->
    <section class="search-form-section">
      <form (ngSubmit)="onSearch()" class="search-form">
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" [(ngModel)]="selectedCategory" name="category" class="form-control">
            <option value="">All Categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <input id="state" [(ngModel)]="state" name="state" class="form-control" placeholder="e.g. Maharashtra" />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input id="city" [(ngModel)]="city" name="city" class="form-control" placeholder="e.g. Mumbai" />
        </div>
        <button type="submit" class="btn-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Search
        </button>
      </form>
    </section>

    <!-- Category Quick Links -->
    <section class="section category-links-section">
      <h2 class="section-title">Browse by Category</h2>
      @if (loading()) {
        <div class="loading-spinner"></div>
      } @else if (error()) {
        <div class="error-message">{{ error() }}</div>
      } @else {
        <div class="category-grid">
          @for (cat of categories(); track cat.id) {
            <div class="category-card" (click)="selectCategory(cat)">
              <h3>{{ cat.name }}</h3>
              @if (cat.children?.length) {
                <ul class="subcategory-list">
                  @for (sub of cat.children; track sub.id) {
                    <li>{{ sub.name }}</li>
                  }
                </ul>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .search-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      color: #fff;
      padding: 3.5rem 2rem 2.5rem;
      text-align: center;
    }
    .search-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.75rem;
    }
    .search-subtitle {
      font-size: 1.1rem;
      opacity: 0.85;
      margin: 0;
    }

    .search-form-section {
      background: #fff;
      padding: 2rem;
      margin: -1.5rem auto 0;
      max-width: 900px;
      border-radius: 0.75rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      position: relative;
      z-index: 1;
    }
    .search-form {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .form-group { flex: 1; min-width: 150px; }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 0.375rem;
    }
    .form-control {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #e94560;
      box-shadow: 0 0 0 3px rgba(233,69,96,0.15);
    }
    .btn-search {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.5rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-search:hover { background: #d63851; transform: translateY(-1px); }

    .section { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
    .section-title { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin: 0 0 1.5rem; }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .category-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .category-card:hover {
      border-color: #e94560;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .category-card h3 {
      margin: 0 0 0.75rem;
      font-size: 1.05rem;
      color: #1a1a2e;
    }
    .subcategory-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .subcategory-list li {
      padding: 0.25rem 0;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .loading-spinner {
      width: 40px; height: 40px;
      border: 4px solid #e5e7eb;
      border-top-color: #e94560;
      border-radius: 50%;
      margin: 2rem auto;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-message { text-align: center; color: #dc2626; padding: 2rem; }

    @media (max-width: 768px) {
      .search-title { font-size: 1.75rem; }
      .search-form { flex-direction: column; }
      .form-group { width: 100%; }
      .btn-search { width: 100%; justify-content: center; }
    }
  `]
})
export class SearchComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  slogan = signal<SearchSlogan | null>(null);
  loading = signal(true);
  error = signal('');

  selectedCategory = '';
  state = '';
  city = '';

  ngOnInit(): void {
    this.api.getCategoryTree().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.error.set('Failed to load categories.')
    });

    this.api.getSearchSlogan().subscribe({
      next: (s) => this.slogan.set(s),
      error: () => {},
      complete: () => this.loading.set(false)
    });
  }

  onSearch(): void {
    const queryParams: Record<string, string> = {};
    if (this.selectedCategory) queryParams['category'] = this.selectedCategory;
    if (this.state) queryParams['state'] = this.state;
    if (this.city) queryParams['city'] = this.city;
    this.router.navigate(['/search'], { queryParams });
  }

  selectCategory(cat: Category): void {
    this.selectedCategory = cat.id;
    this.onSearch();
  }
}
