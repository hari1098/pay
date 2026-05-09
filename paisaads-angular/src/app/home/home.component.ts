import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { LineAd, PosterAd, Category } from '../shared/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Find What You Need</h1>
        <p class="hero-subtitle">Browse thousands of classified ads across India</p>
        <div class="hero-actions">
          <a routerLink="/search" class="btn btn-primary">Browse Ads</a>
          <a routerLink="/dashboard/post-ad" class="btn btn-outline">Post an Ad</a>
        </div>
      </div>
    </section>

    <!-- Category Pills -->
    <section class="section categories-section">
      <h2 class="section-title">Browse Categories</h2>
      @if (categories().length > 0) {
        <div class="category-pills">
          @for (cat of categories(); track cat.id) {
            <a routerLink="/search" [queryParams]="{ category: cat.id }" class="category-pill">
              {{ cat.name }}
            </a>
          }
        </div>
      } @else if (loading()) {
        <div class="loading-spinner"></div>
      }
    </section>

    <!-- Line Ads Today -->
    <section class="section line-ads-section">
      <div class="section-header">
        <h2 class="section-title">Today's Line Ads</h2>
        <a routerLink="/search" class="view-all-link">View All</a>
      </div>
      @if (loading()) {
        <div class="loading-spinner"></div>
      } @else if (error()) {
        <div class="error-message">{{ error() }}</div>
      } @else if (lineAds().length === 0) {
        <div class="empty-state">No ads posted today. Be the first!</div>
      } @else {
        <div class="masonry-grid">
          @for (ad of lineAds(); track ad.id) {
            <div class="ad-card"
                 [style.background-color]="ad.backgroundColor || '#fff'"
                 [style.color]="ad.textColor || '#1a1a2e'">
              <div class="ad-card-header">
                <span class="ad-category">{{ ad.mainCategory?.name }}</span>
                <span class="ad-location">{{ ad.city }}, {{ ad.state }}</span>
              </div>
              <p class="ad-content">{{ ad.content }}</p>
              <div class="ad-card-footer">
                <span class="ad-contact">{{ ad.contactOne }}</span>
                @if (ad.dates?.length) {
                  <span class="ad-date">{{ ad.dates[0] }}</span>
                }
              </div>
            </div>
          }
        </div>
      }
    </section>

    <!-- Poster Ads Section -->
    <section class="section poster-ads-section">
      <h2 class="section-title">Poster Ads</h2>
      @if (loading()) {
        <div class="loading-spinner"></div>
      } @else if (error()) {
        <div class="error-message">{{ error() }}</div>
      } @else if (posterAds().length === 0) {
        <div class="empty-state">No poster ads available right now.</div>
      } @else {
        <div class="poster-grid">
          @for (ad of posterAds(); track ad.id) {
            <div class="poster-card">
              @if (ad.image) {
                <img [src]="ad.image.filePath" [alt]="ad.mainCategory?.name" class="poster-image" />
              } @else if (ad.images?.length) {
                <img [src]="ad.images[0].filePath" [alt]="ad.mainCategory?.name" class="poster-image" />
              } @else {
                <div class="poster-placeholder">No Image</div>
              }
              <div class="poster-info">
                <span class="poster-category">{{ ad.mainCategory?.name }}</span>
                <span class="poster-location">{{ ad.city }}, {{ ad.state }}</span>
              </div>
            </div>
          }
        </div>
      }
    </section>

    <!-- Quick Link Cards -->
    <section class="section quick-links-section">
      <h2 class="section-title">Quick Links</h2>
      <div class="quick-links-grid">
        <a routerLink="/search" class="quick-link-card">
          <div class="quick-link-icon search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h3>Search Ads</h3>
          <p>Find exactly what you're looking for</p>
        </a>
        <a routerLink="/dashboard/post-ad" class="quick-link-card">
          <div class="quick-link-icon post-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <h3>Post an Ad</h3>
          <p>Reach thousands of viewers</p>
        </a>
        <a routerLink="/about-us" class="quick-link-card">
          <div class="quick-link-icon about-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h3>About Us</h3>
          <p>Learn more about PaisaAds</p>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #fff;
      padding: 5rem 2rem;
      text-align: center;
    }
    .hero-content { max-width: 700px; margin: 0 auto; }
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.85;
      margin: 0 0 2rem;
    }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary { background: #e94560; color: #fff; border: none; }
    .btn-primary:hover { background: #d63851; transform: translateY(-1px); }
    .btn-outline { background: transparent; color: #fff; border: 2px solid #fff; }
    .btn-outline:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

    .section { padding: 3rem 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin: 0 0 1.5rem; }
    .view-all-link { color: #e94560; text-decoration: none; font-weight: 600; }

    .category-pills { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .category-pill {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      background: #f0f0f5;
      color: #1a1a2e;
      border-radius: 2rem;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .category-pill:hover { background: #e94560; color: #fff; }

    .masonry-grid {
      columns: 3;
      column-gap: 1.25rem;
    }
    .ad-card {
      break-inside: avoid;
      margin-bottom: 1.25rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      background: #fff;
      transition: box-shadow 0.2s;
    }
    .ad-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .ad-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .ad-category {
      background: rgba(233,69,96,0.1);
      color: #e94560;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .ad-location { font-size: 0.8rem; opacity: 0.7; }
    .ad-content { margin: 0 0 0.75rem; line-height: 1.5; }
    .ad-card-footer { display: flex; justify-content: space-between; font-size: 0.8rem; opacity: 0.75; }
    .ad-date { }

    .poster-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.25rem; }
    .poster-card { border-radius: 0.75rem; overflow: hidden; border: 1px solid #e5e7eb; transition: box-shadow 0.2s; }
    .poster-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .poster-image { width: 100%; height: 200px; object-fit: cover; display: block; }
    .poster-placeholder {
      width: 100%; height: 200px;
      background: #f0f0f5;
      display: flex; align-items: center; justify-content: center;
      color: #999; font-weight: 600;
    }
    .poster-info { padding: 1rem; display: flex; justify-content: space-between; }
    .poster-category { font-weight: 600; color: #1a1a2e; }
    .poster-location { font-size: 0.85rem; color: #666; }

    .quick-links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .quick-link-card {
      display: block;
      padding: 2rem 1.5rem;
      background: #fff;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s;
    }
    .quick-link-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); border-color: #e94560; }
    .quick-link-card h3 { margin: 1rem 0 0.5rem; color: #1a1a2e; font-size: 1.1rem; }
    .quick-link-card p { margin: 0; color: #666; font-size: 0.9rem; }
    .quick-link-icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto;
    }
    .search-icon { background: #eff6ff; color: #3b82f6; }
    .post-icon { background: #fef3c7; color: #f59e0b; }
    .about-icon { background: #f0fdf4; color: #22c55e; }

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
    .empty-state { text-align: center; color: #999; padding: 2rem; font-style: italic; }

    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .masonry-grid { columns: 1; }
      .poster-grid { grid-template-columns: 1fr; }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .masonry-grid { columns: 2; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);

  lineAds = signal<LineAd[]>([]);
  posterAds = signal<PosterAd[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getLineAdsToday().subscribe({
      next: (ads) => this.lineAds.set(ads),
      error: () => this.error.set('Failed to load line ads. Please try again later.')
    });

    this.api.getPosterAdsToday().subscribe({
      next: (ads) => this.posterAds.set(ads),
      error: () => {} // Poster ads are supplementary; don't override error
    });

    this.api.getCategoryTree().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {},
      complete: () => this.loading.set(false)
    });
  }
}
