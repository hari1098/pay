import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-review-video-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Review Video Ads" adType="video" status="FOR_REVIEW,YET_TO_BE_PUBLISHED,HOLD" [canApprove]="true" />`,
})
export class ReviewVideoAdsComponent {}
