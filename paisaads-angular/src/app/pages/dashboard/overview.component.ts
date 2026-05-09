import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DashboardStats } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      @if (isLoading()) {
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-lg border shadow-md p-6"><div class="h-7 w-20 bg-gray-200 rounded animate-pulse mb-2"></div><div class="h-9 w-12 bg-gray-200 rounded animate-pulse"></div></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          @for (tile of tiles; track tile.label) {
            <div class="shadow-md border rounded-lg p-5 flex flex-col items-start" [class]="tile.color">
              <div class="rounded-full p-2 mb-3 bg-white/60 flex items-center justify-center">{{ tile.icon }}</div>
              <p class="text-xs font-semibold uppercase tracking-wide mb-1">{{ tile.label }}</p>
              <p class="text-3xl font-bold">{{ tile.count }}</p>
            </div>
          }
          @for (tile of extraTiles; track tile.label) {
            <div class="shadow-md border rounded-lg p-5 flex flex-col items-start" [class]="tile.color">
              <div class="rounded-full p-2 mb-3 bg-white/60 flex items-center justify-center">{{ tile.icon }}</div>
              <p class="text-xs font-semibold uppercase tracking-wide mb-1">{{ tile.label }}</p>
              <p class="text-2xl font-bold">{{ tile.count }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardOverviewComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);

  tiles: any[] = [];
  extraTiles: any[] = [];

  ngOnInit() {
    this.api.getUserDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
        const inReviewCount = (data.statusCounts.FOR_REVIEW || 0) + (data.statusCounts.YET_TO_BE_PUBLISHED || 0);
        this.tiles = [
          { label: 'TOTAL', count: data.totalAds || 0, icon: '📊', color: 'bg-primary/10 text-primary' },
          { label: 'PUBLISHED', count: data.statusCounts.PUBLISHED || 0, icon: '✅', color: 'bg-green-100 text-green-800' },
          { label: 'DRAFT', count: data.statusCounts.DRAFT || 0, icon: '📝', color: 'bg-yellow-100 text-yellow-800' },
          { label: 'IN REVIEW', count: inReviewCount, icon: '👁', color: 'bg-blue-100 text-blue-800' },
          { label: 'PAUSED', count: data.statusCounts.PAUSED || 0, icon: '⏸', color: 'bg-gray-100 text-gray-800' },
          { label: 'REJECTED', count: data.statusCounts.REJECTED || 0, icon: '❌', color: 'bg-red-100 text-red-800' },
        ];
        this.extraTiles = [
          { label: 'Poster Ads', count: data.posterAds || 0, icon: '🖼', color: 'bg-purple-100 text-purple-800' },
          { label: 'Line Ads', count: data.lineAds || 0, icon: '📋', color: 'bg-pink-100 text-pink-800' },
          { label: 'Video Ads', count: data.videoAds || 0, icon: '🎬', color: 'bg-blue-100 text-blue-800' },
        ];
      },
      error: () => this.isLoading.set(false),
    });
  }
}
