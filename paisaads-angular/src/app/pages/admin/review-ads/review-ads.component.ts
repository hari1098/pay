import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { AdService } from '../../../services/ad.service';
import { LineAd } from '../../../models/ad.model';

@Component({
  selector: 'app-review-ads',
  imports: [MatTableModule, MatIconButton, MatIcon, MatProgressSpinner, MatTooltip],
  templateUrl: './review-ads.html',
  styleUrl: './review-ads.css',
})
export class ReviewAdsComponent implements OnInit {
  private readonly adService = inject(AdService);

  readonly ads = signal<LineAd[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['content', 'category', 'location', 'postedBy', 'actions'];

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds(): void {
    this.loading.set(true);
    this.adService.getAdsByStatus('line', 'PENDING').subscribe({
      next: (res) => {
        this.ads.set(res.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  approve(id: string): void {
    this.adService.approveAd('line', id).subscribe({
      next: () => this.loadAds(),
      error: () => {},
    });
  }

  reject(id: string): void {
    this.adService.rejectAd('line', id).subscribe({
      next: () => this.loadAds(),
      error: () => {},
    });
  }
}
