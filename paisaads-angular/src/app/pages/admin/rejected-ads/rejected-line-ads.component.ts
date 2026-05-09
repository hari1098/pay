import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-rejected-line-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Rejected Line Ads" adType="line" status="REJECTED" />`,
})
export class RejectedLineAdsComponent {}
