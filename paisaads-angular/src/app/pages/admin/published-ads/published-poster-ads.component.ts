import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-published-poster-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Published Poster Ads" adType="poster" status="PUBLISHED" />`,
})
export class PublishedPosterAdsComponent {}
