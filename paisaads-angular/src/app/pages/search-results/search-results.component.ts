import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdService } from '../../services/ad.service';
import { LineAd, AdSearchRequest, PaginatedResponse } from '../../models/ad.model';

@Component({
  selector: 'app-search-results',
  imports: [RouterLink, MatButton, MatCard, MatCardHeader, MatCardContent, MatIcon, MatProgressSpinner],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adService = inject(AdService);

  readonly ads = signal<LineAd[]>([]);
  readonly loading = signal(true);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly searchParams = signal<AdSearchRequest>({});

  readonly pageSize = 20;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchReq: AdSearchRequest = {
        mainCategory: params['mainCategory'] || undefined,
        state: params['state'] || undefined,
        city: params['city'] || undefined,
        page: 0,
        size: this.pageSize,
      };
      this.searchParams.set(searchReq);
      this.currentPage.set(0);
      this.loadAds(searchReq);
    });
  }

  loadAds(params: AdSearchRequest): void {
    this.loading.set(true);
    this.adService.searchLineAds(params).subscribe({
      next: (res: PaginatedResponse<LineAd>) => {
        this.ads.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    const params = { ...this.searchParams(), page, size: this.pageSize };
    this.currentPage.set(page);
    this.loadAds(params);
  }

  pageArray(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const start = Math.max(0, current - 2);
    const end = Math.min(total, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }
}
