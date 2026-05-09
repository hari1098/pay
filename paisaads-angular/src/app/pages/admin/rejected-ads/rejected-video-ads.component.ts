import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-rejected-video-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Rejected Video Ads" adType="video" status="REJECTED" />`,
})
export class RejectedVideoAdsComponent {}
