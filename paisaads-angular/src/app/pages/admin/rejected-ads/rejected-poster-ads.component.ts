import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-rejected-poster-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Rejected Poster Ads" adType="poster" status="REJECTED" />`,
})
export class RejectedPosterAdsComponent {}
