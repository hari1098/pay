import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DashboardStats } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Reports & Analytics</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of summaryStats; track stat.label) {
          <div class="bg-white rounded-lg border shadow-sm p-6" [class]="stat.color">
            <p class="text-sm font-medium opacity-80">{{ stat.label }}</p>
            <p class="text-3xl font-bold mt-2">{{ stat.value }}</p>
          </div>
        }
      </div>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Status Distribution</h2>
        <div class="space-y-3">
          @for (item of statusItems; track item.label) {
            <div class="flex items-center gap-3">
              <span class="text-sm w-32">{{ item.label }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div class="h-full rounded-full" [style.width.%]="item.percentage" [class]="item.barColor"></div>
              </div>
              <span class="text-sm font-semibold w-8 text-right">{{ item.count }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<DashboardStats | null>(null);
  summaryStats: any[] = [];
  statusItems: any[] = [];

  ngOnInit() {
    this.api.getGlobalDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.summaryStats = [
          { label: 'Total Ads', value: data.totalAds || 0, color: 'bg-blue-50 text-blue-600' },
          { label: 'Published', value: data.statusCounts.PUBLISHED || 0, color: 'bg-green-50 text-green-600' },
          { label: 'Pending Review', value: (data.statusCounts.FOR_REVIEW || 0) + (data.statusCounts.YET_TO_BE_PUBLISHED || 0), color: 'bg-orange-50 text-orange-600' },
          { label: 'Rejected', value: data.statusCounts.REJECTED || 0, color: 'bg-red-50 text-red-600' },
        ];
        const total = data.totalAds || 1;
        this.statusItems = Object.entries(data.statusCounts).map(([key, value]) => ({
          label: key.replace(/_/g, ' '),
          count: value,
          percentage: (value / total) * 100,
          barColor: this.getStatusColor(key),
        }));
      },
    });
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'HOLD': return 'bg-yellow-500';
      case 'DRAFT': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  }
}
