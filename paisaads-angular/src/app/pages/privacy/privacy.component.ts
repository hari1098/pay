import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { PrivacyPolicyData } from '../../shared/models/models';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="pt-20 px-4 pb-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto mt-4">Your privacy is important to us. This policy outlines how we collect, use, and protect your information.</p>
        </div>
        @if (isLoading()) {
          <div class="animate-pulse space-y-4"><div class="h-8 bg-gray-200 rounded w-1/3"></div><div class="h-4 bg-gray-200 rounded w-full"></div></div>
        } @else if (privacyData()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            @if (privacyData()!.version) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><div class="flex items-center gap-2"><p class="text-sm text-gray-600">Version</p></div><p class="font-semibold">{{ privacyData()!.version }}</p></div>
            }
            @if (privacyData()!.effectiveDate) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><p class="text-sm text-gray-600">Effective Date</p><p class="font-semibold">{{ privacyData()!.effectiveDate | date }}</p></div>
            }
            @if (privacyData()!.lastUpdated) {
              <div class="bg-white rounded-lg border shadow-sm p-4"><p class="text-sm text-gray-600">Last Updated</p><p class="font-semibold">{{ privacyData()!.lastUpdated | date }}</p></div>
            }
          </div>
          <div class="bg-white rounded-lg border shadow-sm p-6 mb-8">
            @if (privacyData()!.content) {
              <div class="prose max-w-none text-gray-700 leading-relaxed" [innerHTML]="privacyData()!.content"></div>
            } @else {
              <div class="text-center py-12"><p class="text-gray-600">Privacy policy content is being updated.</p></div>
            }
          </div>
        } @else {
          <div class="text-center"><p class="text-gray-600">Privacy policy not available at the moment.</p></div>
        }
      </div>
    </div>
  `,
})
export class PrivacyComponent implements OnInit {
  private api = inject(ApiService);
  privacyData = signal<PrivacyPolicyData | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.api.getPrivacyPolicy().subscribe({
      next: (data) => { this.privacyData.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
