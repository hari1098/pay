import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { TermsData } from '../../shared/models/models';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="pt-20 px-4 pb-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Terms and Conditions</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto mt-4">Please read these terms and conditions carefully before using our service.</p>
        </div>
        @if (isLoading()) {
          <div class="animate-pulse space-y-4"><div class="h-8 bg-gray-200 rounded w-1/3"></div><div class="h-4 bg-gray-200 rounded w-full"></div></div>
        } @else if (termsData()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            @if (termsData()!.version) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><p class="text-sm text-gray-600">Version</p><p class="font-semibold">{{ termsData()!.version }}</p></div>
            }
            @if (termsData()!.effectiveDate) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><p class="text-sm text-gray-600">Effective Date</p><p class="font-semibold">{{ termsData()!.effectiveDate | date }}</p></div>
            }
            @if (termsData()!.lastUpdated) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><p class="text-sm text-gray-600">Last Updated</p><p class="font-semibold">{{ termsData()!.lastUpdated | date }}</p></div>
            }
          </div>
          <div class="bg-white rounded-lg border shadow-sm p-6 mb-8">
            @if (termsData()!.content) {
              <div class="prose max-w-none text-gray-700 leading-relaxed" [innerHTML]="termsData()!.content"></div>
            } @else {
              <div class="text-center py-12"><p class="text-gray-600">Terms and conditions content is being updated.</p></div>
            }
          </div>
          <div class="bg-gray-50 rounded-lg border p-6">
            <p class="text-sm text-gray-600 text-center mb-2">By using our service, you agree to these terms and conditions.</p>
            @if (termsData()!.updatedBy) {
              <p class="text-xs text-gray-500 text-center">Last updated by: {{ termsData()!.updatedBy }}</p>
            }
          </div>
        } @else {
          <div class="text-center"><p class="text-gray-600">Terms and conditions not available at the moment.</p></div>
        }
      </div>
    </div>
  `,
})
export class TermsComponent implements OnInit {
  private api = inject(ApiService);
  termsData = signal<TermsData | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.api.getTermsAndConditions().subscribe({
      next: (data) => { this.termsData.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
