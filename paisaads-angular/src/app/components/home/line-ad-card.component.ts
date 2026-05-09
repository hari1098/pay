import { Component, Input, inject } from '@angular/core';
import { LineAd } from '../../shared/models/models';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-line-ad-card',
  standalone: true,
  template: `
    <div
      class="pt-0 pb-0 h-full flex flex-col overflow-hidden border rounded-lg break-inside-avoid hover:shadow-md transition-shadow duration-300"
      [style.backgroundColor]="ad.backgroundColor || '#ffffff'"
      [style.color]="ad.textColor || '#000000'"
    >
      <div class="p-4 pt-3 pb-0 flex-grow">
        <div class="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-xs opacity-80">
          @for (cat of categories; track $index) {
            <span>{{ cat.name }}{{ $index < categories.length - 1 ? ' |' : '' }}</span>
          }
        </div>
        <p class="text-sm mb-2 text-justify">{{ ad.content }}</p>
        <div class="space-y-1 pb-2 justify-between items-start">
          @if (ad.postedBy || ad.contactOne) {
            <div class="flex items-center text-xs opacity-80">
              <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>{{ ad.postedBy && ad.contactOne ? 'Posted by: ' + ad.postedBy + ' / ' + ad.contactOne : ad.postedBy ? 'Posted by: ' + ad.postedBy : 'Contact: ' + ad.contactOne }}</span>
            </div>
          }
          <div class="flex items-center text-xs opacity-80">
            <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {{ ad.city }}, {{ ad.state }}
          </div>
        </div>
      </div>
      @if (ad.images && ad.images.length > 0) {
        <div class="w-full h-40">
          <img [src]="getImageUrl(ad.images[0].fileName)" alt="Advertisement" class="object-cover w-full h-full" loading="lazy" />
        </div>
      }
    </div>
  `,
})
export class LineAdCardComponent {
  @Input({ required: true }) ad!: LineAd;
  private api = inject(ApiService);
  getImageUrl(fileName: string): string { return this.api.getImageUrl(fileName); }
  get categories() {
    return [this.ad.mainCategory, this.ad.categoryOne, this.ad.categoryTwo, this.ad.categoryThree].filter(Boolean);
  }
}
