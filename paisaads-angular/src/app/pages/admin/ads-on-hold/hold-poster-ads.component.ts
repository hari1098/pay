import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-hold-poster-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Poster Ads On Hold" adType="poster" status="HOLD" [canApprove]="true" />`,
})
export class HoldPosterAdsComponent {}
