import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { LineAd, PosterAd, VideoAd } from '../../shared/models/models';
import { LineAdsComponent } from '../../components/home/line-ads.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [FormsModule, LineAdsComponent],
  template: `
    <div class="pt-5 px-2 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-5">
      <div class="hidden md:block md:col-span-2">
        <div class="flex items-center flex-col gap-5">
          @for (ad of filteredPosterAds().slice(0, 3); track ad.id) {
            <div class="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[1/1.2]">
              <img [src]="getImageUrl(ad.image.fileName)" alt="Ad" class="object-cover w-full h-full" loading="lazy" />
            </div>
          }
        </div>
      </div>
      <div class="col-span-1 md:col-span-8 flex flex-col gap-5">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
          <form (ngSubmit)="onSearch()" class="flex flex-wrap items-center gap-2">
            <input type="text" [(ngModel)]="searchText" name="search" placeholder="Search ads..." class="h-10 flex-1 min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" />
            <button type="submit" class="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
              <svg class="mr-2 h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Search Now
            </button>
          </form>
        </div>
        <app-line-ads />
      </div>
      <div class="hidden md:block md:col-span-2">
        <div class="flex items-center flex-col gap-5">
          @for (ad of filteredPosterAds().slice(3, 6); track ad.id) {
            <div class="relative overflow-hidden rounded-lg shadow-md group w-full aspect-[1/1.2]">
              <img [src]="getImageUrl(ad.image.fileName)" alt="Ad" class="object-cover w-full h-full" loading="lazy" />
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SearchResultsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  filteredPosterAds = signal<PosterAd[]>([]);
  videoAds = signal<VideoAd[]>([]);
  searchText = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'] || '';
      const stateId = params['stateId'] || '';
      const cityId = params['cityId'] || '';
      this.api.getPosterAdsToday({ categoryId, stateId, cityId }).subscribe(data => {
        this.filteredPosterAds.set(data.filter((ad: PosterAd) => ad.position?.side !== 'CENTER_BOTTOM' && ad.position?.side !== 'CENTER_TOP'));
      });
      this.api.getVideoAdsToday({ categoryId, stateId, cityId }).subscribe(data => this.videoAds.set(data));
    });
  }

  onSearch() {
    this.router.navigate(['/search/results'], { queryParams: { search: this.searchText || undefined } });
  }

  getImageUrl(fileName: string): string { return this.api.getImageUrl(fileName); }
}
