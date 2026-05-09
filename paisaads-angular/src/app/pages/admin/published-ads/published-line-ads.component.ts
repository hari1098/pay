import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-published-line-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Published Line Ads" adType="line" status="PUBLISHED" />`,
})
export class PublishedLineAdsComponent {}
