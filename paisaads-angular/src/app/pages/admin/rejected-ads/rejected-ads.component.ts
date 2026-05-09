import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdService } from '../../../services/ad.service';
import { LineAd } from '../../../models/ad.model';

@Component({
  selector: 'app-rejected-ads',
  imports: [MatTableModule, MatIcon, MatProgressSpinner],
  templateUrl: './rejected-ads.html',
  styleUrl: './rejected-ads.css',
})
export class RejectedAdsComponent implements OnInit {
  private readonly adService = inject(AdService);

  readonly ads = signal<LineAd[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['content', 'category', 'location', 'postedBy', 'date'];

  ngOnInit(): void {
    this.adService.getAdsByStatus('line', 'REJECTED').subscribe({
      next: (res) => {
        this.ads.set(res.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
