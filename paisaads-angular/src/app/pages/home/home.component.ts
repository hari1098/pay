import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdService } from '../../services/ad.service';
import { CategoryService } from '../../services/category.service';
import { LineAd } from '../../models/ad.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButton, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions, MatChipSet, MatChip, MatIcon, MatProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private readonly adService = inject(AdService);
  private readonly categoryService = inject(CategoryService);

  readonly lineAds = signal<LineAd[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);

  readonly quickLinks = [
    { title: 'Search Ads', description: 'Browse thousands of classified ads across categories', icon: 'search', link: '/search', color: '#1565c0' },
    { title: 'Post an Ad', description: 'Create your ad and reach a wide audience instantly', icon: 'campaign', link: '/dashboard/post-ad', color: '#2e7d32' },
    { title: 'About PaisaAds', description: 'Learn more about our platform and mission', icon: 'info', link: '/about-us', color: '#e65100' },
  ];

  ngOnInit(): void {
    this.loadLineAds();
    this.loadCategories();
  }

  private loadLineAds(): void {
    this.adService.getLineAdsToday({ page: 0, size: 20 }).subscribe({
      next: (res) => {
        this.lineAds.set(res.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategoriesTree().subscribe({
      next: (res) => {
        this.categories.set(res.mainCategories ?? []);
      },
      error: () => {},
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
