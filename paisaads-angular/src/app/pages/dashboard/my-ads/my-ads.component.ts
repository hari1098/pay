import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdService } from '../../../services/ad.service';
import { LineAd } from '../../../models/ad.model';

@Component({
  selector: 'app-my-ads',
  imports: [RouterLink, MatTableModule, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './my-ads.html',
  styleUrl: './my-ads.css',
})
export class MyAdsComponent implements OnInit {
  private readonly adService = inject(AdService);

  readonly lineAds = signal<LineAd[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['category', 'content', 'location', 'status', 'date'];

  ngOnInit(): void {
    this.adService.getMyLineAds().subscribe({
      next: (ads) => {
        this.lineAds.set(ads);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
