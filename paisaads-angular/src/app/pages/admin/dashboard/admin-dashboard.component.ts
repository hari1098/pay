import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DashboardStats } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="space-y-8 p-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
      </div>
      @if (isLoading()) {
        <div class="animate-pulse space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">@for (i of [1,2,3,4]; track i) { <div class="h-24 bg-gray-200 rounded-lg"></div> }</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">@for (i of [1,2,3]; track i) { <div class="h-20 bg-gray-200 rounded-lg"></div> }</div>
        </div>
      } @else {
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800">Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (tile of overviewTiles; track tile.label) {
              <div class="border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 rounded-lg p-6" [class]="tile.color">
                <div class="flex items-center justify-between">
                  <div class="space-y-2">
                    <p class="text-sm font-medium opacity-80">{{ tile.label }}</p>
                    <p class="text-3xl font-bold">{{ tile.count }}</p>
                    <p class="text-xs opacity-70">{{ tile.description }}</p>
                  </div>
                  <div class="p-3 rounded-lg" [class]="tile.iconBg">{{ tile.icon }}</div>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800">Ad Types</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (tile of adTypeTiles; track tile.label) {
              <div class="border-2 hover:shadow-md transition-all duration-200 rounded-lg p-6" [class]="tile.color">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">{{ tile.icon }}</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium opacity-80">{{ tile.label }}</p>
                    <p class="text-2xl font-bold">{{ tile.count }}</p>
                    <p class="text-xs opacity-70 truncate">{{ tile.description }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="border-2 border-gray-200 shadow-lg rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">📈 Ad Status Distribution</h3>
            @if (stats()) {
              <div class="space-y-3">
                @for (item of statusDistribution; track item.label) {
                  <div class="flex items-center gap-3">
                    <span class="text-sm w-28">{{ item.label }}</span>
                    <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" [style.width.%]="item.percentage" [class]="item.barColor"></div>
                    </div>
                    <span class="text-sm font-semibold w-8 text-right">{{ item.count }}</span>
                  </div>
                }
              </div>
            }
          </div>
          <div class="border-2 border-gray-200 shadow-lg rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">👁 Quick Actions</h3>
            <div class="space-y-4">
              <div class="text-sm text-gray-600">
                <p class="font-medium mb-2">Recent Activity</p>
                <div class="space-y-2">
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Ads pending review</span>
                    <span class="font-semibold text-orange-600">{{ inReviewCount }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Published</span>
                    <span class="font-semibold text-green-600">{{ stats()?.statusCounts?.PUBLISHED || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total ads</span>
                    <span class="font-semibold text-blue-600">{{ stats()?.totalAds || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);
  inReviewCount = 0;

  overviewTiles: any[] = [];
  adTypeTiles: any[] = [];
  statusDistribution: any[] = [];

  ngOnInit() {
    this.api.getGlobalDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
        this.inReviewCount = (data.statusCounts.FOR_REVIEW || 0) + (data.statusCounts.YET_TO_BE_PUBLISHED || 0);
        this.overviewTiles = [
          { label: 'Total Ads', count: data.totalAds || 0, icon: '📊', description: 'All advertisements', color: 'bg-blue-50 text-blue-600 border-blue-200', iconBg: 'bg-blue-100' },
          { label: 'Published', count: data.statusCounts.PUBLISHED || 0, icon: '✅', description: 'Live advertisements', color: 'bg-green-50 text-green-600 border-green-200', iconBg: 'bg-green-100' },
          { label: 'In Review', count: this.inReviewCount, icon: '⏰', description: 'Pending approval', color: 'bg-orange-50 text-orange-600 border-orange-200', iconBg: 'bg-orange-100' },
          { label: 'Draft', count: data.statusCounts.DRAFT || 0, icon: '📝', description: 'Draft advertisements', color: 'bg-gray-50 text-gray-600 border-gray-200', iconBg: 'bg-gray-100' },
        ];
        this.adTypeTiles = [
          { label: 'Line Ads', count: data.lineAds || 0, icon: '📋', description: 'Text-based ads', color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { label: 'Poster Ads', count: data.posterAds || 0, icon: '🖼', description: 'Image advertisements', color: 'bg-pink-50 text-pink-600 border-pink-200' },
          { label: 'Video Ads', count: data.videoAds || 0, icon: '🎬', description: 'Video advertisements', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
        ];
        const total = data.totalAds || 1;
        this.statusDistribution = [
          { label: 'Published', count: data.statusCounts.PUBLISHED || 0, percentage: ((data.statusCounts.PUBLISHED || 0) / total) * 100, barColor: 'bg-green-500' },
          { label: 'In Review', count: this.inReviewCount, percentage: (this.inReviewCount / total) * 100, barColor: 'bg-orange-500' },
          { label: 'Draft', count: data.statusCounts.DRAFT || 0, percentage: ((data.statusCounts.DRAFT || 0) / total) * 100, barColor: 'bg-gray-400' },
          { label: 'Rejected', count: data.statusCounts.REJECTED || 0, percentage: ((data.statusCounts.REJECTED || 0) / total) * 100, barColor: 'bg-red-500' },
          { label: 'On Hold', count: data.statusCounts.HOLD || 0, percentage: ((data.statusCounts.HOLD || 0) / total) * 100, barColor: 'bg-yellow-500' },
        ];
      },
      error: () => this.isLoading.set(false),
    });
  }
}
