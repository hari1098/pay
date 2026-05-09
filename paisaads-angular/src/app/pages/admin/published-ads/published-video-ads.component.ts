import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-published-video-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Published Video Ads" adType="video" status="PUBLISHED" />`,
})
export class PublishedVideoAdsComponent {}
