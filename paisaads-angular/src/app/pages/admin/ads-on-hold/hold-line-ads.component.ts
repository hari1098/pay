import { Component } from '@angular/core';
import { AdminAdsListComponent } from '../admin-ads-list.component';

@Component({
  selector: 'app-hold-line-ads',
  standalone: true,
  imports: [AdminAdsListComponent],
  template: `<app-admin-ads-list title="Line Ads On Hold" adType="line" status="HOLD" [canApprove]="true" />`,
})
export class HoldLineAdsComponent {}
