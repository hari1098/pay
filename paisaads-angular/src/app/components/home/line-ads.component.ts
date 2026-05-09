import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { LineAd } from '../../shared/models/models';
import { LineAdCardComponent } from './line-ad-card.component';

@Component({
  selector: 'app-line-ads',
  standalone: true,
  imports: [LineAdCardComponent],
  template: `
    <div class="flex-1">
      <div class="py-4">
        @if (isLoading()) {
          <div class="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="h-full flex flex-col overflow-hidden break-inside-avoid mb-4 rounded-lg border p-4">
                <div class="flex flex-wrap gap-1 mb-3"><div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div><div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div></div>
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-3 w-32 bg-gray-200 rounded animate-pulse mt-4 mb-1"></div>
                <div class="h-3 w-40 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div class="aspect-video w-full bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
            }
          </div>
        } @else if (data().length > 0) {
          <div class="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 transition-all duration-300">
            @for (ad of paginatedItems(); track ad.id) {
              <app-line-ad-card [ad]="ad" />
            }
          </div>
          @if (isAuthenticated() && totalPages() > 1) {
            <div class="flex justify-center items-center gap-2 mt-8">
              <button class="px-4 py-2 text-sm border rounded-md disabled:opacity-50" [disabled]="currentPage() === 1" (click)="prevPage()">Previous</button>
              @for (page of pageNumbers(); track page) {
                <button class="px-4 py-2 text-sm rounded-md" [class]="page === currentPage() ? 'bg-[#1a1a2e] text-white' : 'border'" (click)="currentPage.set(page)">{{ page }}</button>
              }
              <button class="px-4 py-2 text-sm border rounded-md disabled:opacity-50" [disabled]="currentPage() === totalPages()" (click)="nextPage()">Next</button>
            </div>
          }
        } @else {
          <div class="text-center py-12">
            <p class="text-gray-500">No advertisements available today.</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class LineAdsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  data = signal<LineAd[]>([]);
  isLoading = signal(true);
  isAuthenticated = signal(false);
  currentPage = signal(1);
  ADS_PER_PAGE = 12;

  paginatedItems = signal<LineAd[]>([]);
  totalPages = signal(1);
  pageNumbers = signal<number[]>([]);

  ngOnInit() {
    this.api.checkAuth().subscribe({ next: () => this.isAuthenticated.set(true), error: () => this.isAuthenticated.set(false) });
    this.api.getLineAdsToday().subscribe({
      next: (d) => {
        this.data.set(d.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()));
        this.isLoading.set(false);
        this.updatePagination();
      },
      error: () => this.isLoading.set(false)
    });
    effect(() => { this.currentPage(); this.updatePagination(); });
  }

  prevPage() { this.currentPage.update(v => v - 1); }
  nextPage() { this.currentPage.update(v => v + 1); }

  private updatePagination() {
    const d = this.data();
    this.totalPages.set(Math.ceil(d.length / this.ADS_PER_PAGE) || 1);
    const pages = Array.from({ length: this.totalPages() }, (_, i) => i + 1);
    this.pageNumbers.set(pages);
    if (!this.isAuthenticated()) {
      this.paginatedItems.set(d.slice(0, this.ADS_PER_PAGE));
    } else {
      const start = (this.currentPage() - 1) * this.ADS_PER_PAGE;
      this.paginatedItems.set(d.slice(start, start + this.ADS_PER_PAGE));
    }
  }
}
