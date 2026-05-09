import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { PosterAd } from '../../../shared/models/models';

@Component({
  selector: 'app-view-poster-ad',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-3xl mx-auto">
      <div class="flex items-center gap-4">
        <a routerLink="/dashboard/my-ads/poster-ads" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to My Ads</a>
      </div>
      @if (isLoading()) {
        <div class="h-[300px] bg-gray-100 rounded animate-pulse"></div>
      } @else if (ad()) {
        <div class="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Poster Ad Details</h1>
            <span class="px-3 py-1 rounded-full text-xs font-medium" [class]="getStatusClass(ad()!.status)">{{ ad()!.status }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p class="text-sm text-gray-500">Order ID</p><p class="font-medium">{{ getOrderId() }}</p></div>
            <div><p class="text-sm text-gray-500">Title</p><p class="font-medium">{{ ad()!.title || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">Category</p><p class="font-medium">{{ ad()!.mainCategory?.name || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">Position</p><p class="font-medium">{{ ad()!.position || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">State</p><p class="font-medium">{{ ad()!.state || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">City</p><p class="font-medium">{{ ad()!.city || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">Posted By</p><p class="font-medium">{{ ad()!.postedBy || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">Contact</p><p class="font-medium">{{ ad()!.contactOne || '-' }}</p></div>
          </div>
          @if (ad()!.link) {
            <div><p class="text-sm text-gray-500">Link</p><a [href]="ad()!.link" target="_blank" class="text-blue-600 hover:underline">{{ ad()!.link }}</a></div>
          }
          @if (ad()!.images && ad()!.images!.length > 0) {
            <div>
              <p class="text-sm text-gray-500 mb-2">Images</p>
              <div class="flex gap-2 flex-wrap">
                @for (img of ad()!.images; track img.id) {
                  <img [src]="getImageUrl(img.fileName)" class="w-48 h-48 object-cover rounded border" />
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ViewPosterAdComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  ad = signal<PosterAd | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.api.getPosterAdById(id).subscribe({
      next: (data) => { this.ad.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  getImageUrl(fileName: string): string {
    return this.api.getImageUrl(fileName);
  }

  getOrderId(): string {
    const ad = this.ad();
    if (!ad) return '';
    return 'PA' + (ad.sequenceNumber != null ? ad.sequenceNumber.toString().padStart(4, '0') : ad.id.slice(0, 6));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'FOR_REVIEW': case 'YET_TO_BE_PUBLISHED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
