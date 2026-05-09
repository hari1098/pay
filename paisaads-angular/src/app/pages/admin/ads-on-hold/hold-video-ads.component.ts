import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-hold-video-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Video Ads On Hold" adType="video" status="HOLD" [canApprove]="true" />`,
})
export class HoldVideoAdsComponent {}
