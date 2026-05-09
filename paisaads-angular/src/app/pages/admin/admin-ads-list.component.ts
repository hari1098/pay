import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-ads-list',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">{{ title }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full border text-sm">{{ ads().length }} Ads</span>
        </div>
      </div>
      @if (isLoading()) {
        <div class="space-y-4">@for (i of [1,2,3]; track i) { <div class="h-16 bg-gray-100 rounded animate-pulse"></div> }</div>
      } @else if (ads().length > 0) {
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b"><tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              @for (ad of ads(); track ad.id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium">{{ getOrderId(ad) }}</td>
                  <td class="px-4 py-3 text-sm">{{ ad.mainCategory?.name || '-' }}</td>
                  <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" [class]="getStatusClass(ad.status)">{{ ad.status }}</span></td>
                  <td class="px-4 py-3 text-sm">
                    <div class="flex gap-2">
                      @if (canApprove) {
                        <button class="text-green-600 hover:underline" (click)="onApprove(ad.id)">Approve</button>
                        <button class="text-red-600 hover:underline" (click)="onReject(ad.id)">Reject</button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="rounded-md border border-dashed p-8 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">✅</div>
          <h2 class="mt-4 text-lg font-semibold">No Ads Found</h2>
          <p class="mt-2 text-sm text-gray-500">There are currently no ads matching this criteria.</p>
        </div>
      }
    </div>
  `,
})
export class AdminAdsListComponent implements OnInit {
  @Input() title = 'Ads';
  @Input() adType: 'line' | 'poster' | 'video' = 'line';
  @Input() status = '';
  @Input() canApprove = true;

  private api = inject(ApiService);
  private notification = inject(NotificationService);
  ads = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadAds();
  }

  private loadAds() {
    const apiCall: Observable<any[]> = this.adType === 'line'
      ? this.api.getLineAdsByStatus(this.status)
      : this.adType === 'poster'
        ? this.api.getPosterAdsByStatus(this.status)
        : this.api.getVideoAdsByStatus(this.status);

    apiCall.subscribe({
      next: (data: any[]) => { this.ads.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  getOrderId(ad: any): string {
    const prefix = this.adType === 'line' ? 'LA' : this.adType === 'poster' ? 'PA' : 'VD';
    return prefix + (ad.sequenceNumber?.toString().padStart(4, '0') || ad.id.slice(0, 6));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'FOR_REVIEW': case 'YET_TO_BE_PUBLISHED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'HOLD': return 'bg-orange-100 text-orange-800';
      case 'PAUSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onApprove(id: string) {
    const approveCall: Observable<any> = this.adType === 'line'
      ? this.api.approveLineAd(id, 'Approved')
      : this.adType === 'poster'
        ? this.api.approvePosterAd(id, 'Approved')
        : this.api.approveVideoAd(id, 'Approved');

    approveCall.subscribe({
      next: () => { this.notification.success('Ad approved'); this.loadAds(); },
      error: () => this.notification.error('Failed to approve ad'),
    });
  }

  onReject(id: string) {
    const rejectCall: Observable<any> = this.adType === 'line'
      ? this.api.rejectLineAd(id, 'Rejected')
      : this.adType === 'poster'
        ? this.api.rejectPosterAd(id, 'Rejected')
        : this.api.rejectVideoAd(id, 'Rejected');

    rejectCall.subscribe({
      next: () => { this.notification.success('Ad rejected'); this.loadAds(); },
      error: () => this.notification.error('Failed to reject ad'),
    });
  }
}
