import { Component, Input, signal, computed, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-ad-carousel',
  standalone: true,
  template: `
    <div class="relative w-full">
      <div class="w-full">
        @if (currentAd()?.type === 'video') {
          <div class="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[4/5] md:aspect-[1/1.2]">
            <div class="relative h-full w-full overflow-hidden bg-gray-200">
              <video class="object-cover w-full h-full" playsinline preload="metadata" controls>
                <source [src]="getImageUrl(currentAd()!.ad.image.fileName)" type="video/mp4" />
              </video>
              @if (currentAd()!.ad.mainCategory?.name) {
                <div class="absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium z-10" [style.backgroundColor]="currentAd()!.ad.mainCategory?.categories_color || '#8B5CF6'" [style.color]="currentAd()!.ad.mainCategory?.font_color || 'white'">{{ currentAd()!.ad.mainCategory.name }}</div>
              }
            </div>
          </div>
        } @else if (currentAd()) {
          <div class="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[4/5] md:aspect-[1/1.2]">
            <div class="relative h-full w-full overflow-hidden">
              <img [src]="getImageUrl(currentAd()!.ad.image.fileName)" alt="Advertisement" class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              @if (currentAd()!.ad.mainCategory?.name) {
                <div class="absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium z-10" [style.backgroundColor]="currentAd()!.ad.mainCategory?.categories_color || '#10B981'" [style.color]="currentAd()!.ad.mainCategory?.font_color || 'white'">{{ currentAd()!.ad.mainCategory.name }}</div>
              }
            </div>
          </div>
        }
      </div>
      @if (ads.length > 1) {
        <button class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20 transition-colors" (click)="prevAd()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-20 transition-colors" (click)="nextAd()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          @for (item of ads; track $index) {
            <button class="w-2 h-2 rounded-full transition-colors" [class]="$index === currentIndex() ? 'bg-white' : 'bg-white/50'" (click)="currentIndex.set($index)"></button>
          }
        </div>
      }
    </div>
  `,
})
export class AdCarouselComponent {
  @Input() ads: any[] = [];
  currentIndex = signal(0);
  currentAd = computed(() => this.ads[this.currentIndex()] || null);
  private api = inject(ApiService);
  nextAd() { this.currentIndex.update(v => (v + 1) % this.ads.length); }
  prevAd() { this.currentIndex.update(v => (v - 1 + this.ads.length) % this.ads.length); }
  getImageUrl(fileName: string): string { return this.api.getImageUrl(fileName); }
}
