import { Component, Input, signal, inject } from '@angular/core';
import { PosterAd } from '../../shared/models/models';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-poster-ad-center',
  standalone: true,
  template: `
    <div class="flex flex-col gap-5">
      <div class="overflow-hidden h-72 relative select-none rounded-lg">
        @if (topAds && topAds.length > 0) {
          @if (currentTopAdIndex() > 0) {
            <svg class="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" (click)="prevTopAd()"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          }
          @if (currentTopAdIndex() < topAds.length - 1) {
            <svg class="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" (click)="nextTopAd()"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          }
          <div class="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2 z-10">
            <span class="leading-none text-white text-xs">{{ currentTopAdIndex() + 1 }} / {{ topAds.length }}</span>
          </div>
          <img [src]="getImageUrl(topAds[currentTopAdIndex()].image.fileName)" alt="Top Ad" class="w-full h-full object-cover" />
        }
      </div>
      <ng-content />
      <div class="overflow-hidden h-72 relative select-none rounded-lg">
        @if (bottomAds && bottomAds.length > 0) {
          @if (currentBottomAdIndex() > 0) {
            <svg class="cursor-pointer size-8 text-gray-800 absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" (click)="prevBottomAd()"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          }
          @if (currentBottomAdIndex() < bottomAds.length - 1) {
            <svg class="cursor-pointer size-8 text-gray-800 absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-xl rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" (click)="nextBottomAd()"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          }
          <div class="pb-0.5 absolute bg-black px-3 bottom-2 rounded-full left-1/2 -translate-x-1/2 z-10">
            <span class="leading-none text-white text-xs">{{ currentBottomAdIndex() + 1 }} / {{ bottomAds.length }}</span>
          </div>
          <img [src]="getImageUrl(bottomAds[currentBottomAdIndex()].image.fileName)" alt="Bottom Ad" class="w-full h-full object-cover" />
        }
      </div>
    </div>
  `,
})
export class PosterAdCenterComponent {
  @Input() topAds: PosterAd[] = [];
  @Input() bottomAds: PosterAd[] = [];
  currentTopAdIndex = signal(0);
  currentBottomAdIndex = signal(0);
  private api = inject(ApiService);
  getImageUrl(fileName: string): string { return this.api.getImageUrl(fileName); }

  prevTopAd() { const len = this.topAds.length; this.currentTopAdIndex.update(v => (v - 1 + len) % len); }
  nextTopAd() { const len = this.topAds.length; this.currentTopAdIndex.update(v => (v + 1) % len); }
  prevBottomAd() { const len = this.bottomAds.length; this.currentBottomAdIndex.update(v => (v - 1 + len) % len); }
  nextBottomAd() { const len = this.bottomAds.length; this.currentBottomAdIndex.update(v => (v + 1) % len); }
}
