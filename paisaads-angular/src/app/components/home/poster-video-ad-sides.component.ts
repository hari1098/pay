import { Component, Input, computed } from '@angular/core';
import { PosterAd, VideoAd, PositionType } from '../../shared/models/models';
import { AdCarouselComponent } from './ad-carousel.component';

@Component({
  selector: 'app-poster-video-ad-sides',
  standalone: true,
  imports: [AdCarouselComponent],
  template: `
    @if (adsGroupedByPosition().length === 0) {
      <div class="flex items-center flex-col gap-5"></div>
    } @else {
      <div class="flex items-center flex-col md:gap-5 gap-3">
        <div class="md:hidden w-full overflow-x-auto">
          <div class="flex gap-3 pb-2" [style.width]="adsGroupedByPosition().length * 250 + 'px'">
            @for (group of adsGroupedByPosition().slice(0, 6); track group.position) {
              <div class="min-w-[240px] flex-shrink-0">
                <app-ad-carousel [ads]="group.ads" />
              </div>
            }
          </div>
        </div>
        <div class="hidden md:flex md:flex-col md:gap-5 md:items-center">
          @for (group of adsGroupedByPosition(); track group.position) {
            <div class="w-full">
              <app-ad-carousel [ads]="group.ads" />
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class PosterVideoAdSidesComponent {
  @Input() side: 'left' | 'right' = 'left';
  @Input() posterAds: PosterAd[] = [];
  @Input() videoAds: VideoAd[] = [];

  adsGroupedByPosition = computed(() => {
    const targetSide = this.side === 'left' ? PositionType.LEFT_SIDE : PositionType.RIGHT_SIDE;
    const positions = [1, 2, 3, 4, 5, 6];
    return positions.map(positionNum => ({
      position: positionNum,
      ads: this.getAdsForPosition(positionNum, targetSide)
    })).filter(group => group.ads.length > 0);
  });

  private getAdsForPosition(positionNum: number, targetSide: string) {
    const positionAds: any[] = [];
    const videoAdsForPosition = (this.videoAds || []).filter(ad => ad.position?.side === targetSide && ad.position?.position === positionNum);
    videoAdsForPosition.forEach(ad => positionAds.push({ type: 'video', ad }));
    const posterAdsForPosition = (this.posterAds || []).filter(ad => ad.position?.side === targetSide && ad.position?.position === positionNum);
    posterAdsForPosition.forEach(ad => positionAds.push({ type: 'poster', ad }));
    return positionAds.slice(0, 5);
  }
}
