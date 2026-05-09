import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { VideoAd } from '../../../../shared/models/models';

@Component({
  selector: 'app-my-ads-video',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">My Video Ads</h1>
        <a routerLink="/dashboard/post-ad/video-ad" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-md text-sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Post New Ad
        </a>
      </div>
      @if (isLoading()) {
        <div class="space-y-4">@for (i of [1,2,3]; track i) { <div class="h-16 bg-gray-100 rounded animate-pulse"></div> }</div>
      } @else if (ads().length > 0) {
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody>
              @for (ad of ads(); track ad.id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{{ getOrderId(ad) }}</td>
                  <td class="px-4 py-3 text-sm">{{ ad.mainCategory?.name || '-' }}</td>
                  <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" [class]="getStatusClass(ad.status)">{{ ad.status }}</span></td>
                  <td class="px-4 py-3 text-sm">
                    <div class="flex gap-2">
                      <a [routerLink]="['/dashboard/edit-ad/video-ad', ad.id]" class="text-blue-600 hover:underline">Edit</a>
                      <a [routerLink]="['/dashboard/view-ad/video-ad', ad.id]" class="text-gray-600 hover:underline">View</a>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="text-center py-12"><p class="text-gray-500">No video ads found. Create your first ad!</p></div>
      }
    </div>
  `,
})
export class MyAdsVideoComponent implements OnInit {
  private api = inject(ApiService);
  ads = signal<VideoAd[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.api.getMyVideoAds().subscribe({
      next: (data) => { this.ads.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'FOR_REVIEW': case 'YET_TO_BE_PUBLISHED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PAUSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getOrderId(ad: VideoAd): string {
    return 'VD' + (ad.sequenceNumber != null ? ad.sequenceNumber.toString().padStart(4, '0') : ad.id.slice(0, 6));
  }
}
