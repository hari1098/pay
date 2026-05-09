import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { LineAd, PosterAd, VideoAd } from '../../shared/models/models';
import { LineAdsComponent } from '../../components/home/line-ads.component';
import { PosterAdCenterComponent } from '../../components/home/poster-ad-center.component';
import { PosterVideoAdSidesComponent } from '../../components/home/poster-video-ad-sides.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LineAdsComponent, PosterAdCenterComponent, PosterVideoAdSidesComponent],
  template: `
    <div class="pt-2 md:pt-5 px-2 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
      <div class="hidden md:block md:col-span-2">
        <app-poster-video-ad-sides side="left" [posterAds]="filteredPosterAds()" [videoAds]="videoAds()" />
      </div>
      <div class="col-span-1 md:col-span-8">
        <app-poster-ad-center [topAds]="centerTopPosterAd()" [bottomAds]="centerBottomPosterAd()">
          <app-line-ads />
        </app-poster-ad-center>
      </div>
      <div class="hidden md:block md:col-span-2">
        <app-poster-video-ad-sides side="right" [posterAds]="filteredPosterAds()" [videoAds]="videoAds()" />
      </div>
      <div class="md:hidden col-span-1 space-y-4">
        <div class="w-full">
          <h3 class="text-lg font-semibold mb-2 text-center">Featured Ads</h3>
          <app-poster-video-ad-sides side="left" [posterAds]="filteredPosterAds()" [videoAds]="videoAds()" />
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  lineAds = signal<LineAd[]>([]);
  videoAds = signal<VideoAd[]>([]);
  posterAds = signal<PosterAd[]>([]);
  filteredPosterAds = signal<PosterAd[]>([]);
  centerTopPosterAd = signal<PosterAd[]>([]);
  centerBottomPosterAd = signal<PosterAd[]>([]);

  ngOnInit() {
    this.api.getLineAdsToday().subscribe(data => this.lineAds.set(data));
    this.api.getVideoAdsToday().subscribe(data => this.videoAds.set(data));
    this.api.getPosterAdsToday().subscribe({
      next: (data) => {
        this.posterAds.set(data);
        this.filteredPosterAds.set(data.filter((ad: PosterAd) => ad.position?.side !== 'CENTER_BOTTOM' && ad.position?.side !== 'CENTER_TOP'));
        this.centerBottomPosterAd.set(data.filter((ad: PosterAd) => ad.position?.side === 'CENTER_BOTTOM'));
        this.centerTopPosterAd.set(data.filter((ad: PosterAd) => ad.position?.side === 'CENTER_TOP'));
      }
    });
  }
}
