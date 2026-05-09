import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';

interface ReportData {
  totalUsers: number;
  totalAds: number;
  pendingAds: number;
  publishedAds: number;
  rejectedAds: number;
}

@Component({
  selector: 'app-reports',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatIcon, MatProgressSpinner],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class ReportsComponent extends ApiService implements OnInit {
  readonly report = signal<ReportData>({
    totalUsers: 0,
    totalAds: 0,
    pendingAds: 0,
    publishedAds: 0,
    rejectedAds: 0,
  });
  readonly loading = signal(true);

  ngOnInit(): void {
    this.get<ReportData>('/admin/reports/summary').subscribe({
      next: (data) => {
        this.report.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
