import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-review-poster-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Review Poster Ads" adType="poster" status="FOR_REVIEW,YET_TO_BE_PUBLISHED,HOLD" [canApprove]="true" />`,
})
export class ReviewPosterAdsComponent {}
