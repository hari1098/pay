import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-ad-pricing',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="border rounded-lg shadow-sm">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold flex items-center gap-2">Ad Pricing Configuration</h2>
        </div>
        <div class="p-6">
          @if (isLoading()) {
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">@for (i of [1,2,3]; track i) { <div class="h-20 bg-gray-100 rounded animate-pulse"></div> }</div>
              <div class="h-10 w-32 bg-gray-100 rounded animate-pulse"></div>
            </div>
          } @else {
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 border-blue-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-blue-600">Line Ads</p>
                  <p class="text-2xl font-bold text-blue-800">{{ formatCurrency(currentPricing()?.lineAdPrice || 0) }}</p>
                </div>
                <div class="bg-green-50 border-green-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-green-600">Poster Ads</p>
                  <p class="text-2xl font-bold text-green-800">{{ formatCurrency(currentPricing()?.posterAdPrice || 0) }}</p>
                </div>
                <div class="bg-purple-50 border-purple-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-purple-600">Video Ads</p>
                  <p class="text-2xl font-bold text-purple-800">{{ formatCurrency(currentPricing()?.videoAdPrice || 0) }}</p>
                </div>
              </div>
              <form [formGroup]="pricingForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div><label class="block text-sm font-medium mb-1">Line Ad Price</label><input type="number" min="0" step="1" formControlName="lineAdPrice" placeholder="Enter line ad price" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                    <div><label class="block text-sm font-medium mb-1">Poster Ad Price</label><input type="number" min="0" step="1" formControlName="posterAdPrice" placeholder="Enter poster ad price" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  </div>
                  <div class="space-y-4">
                    <div><label class="block text-sm font-medium mb-1">Video Ad Price</label><input type="number" min="0" step="1" formControlName="videoAdPrice" placeholder="Enter video ad price" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                    <div><label class="block text-sm font-medium mb-1">Currency</label><input type="text" formControlName="currency" readonly class="h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm" /></div>
                  </div>
                </div>
                <div class="flex justify-between items-center pt-4 border-t">
                  <span class="text-sm text-gray-500">{{ hasChanges() ? 'Unsaved changes' : '' }}</span>
                  <button type="submit" [disabled]="!hasChanges() || isSaving()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">
                    {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
              @if (currentPricing()) {
                <div class="text-sm text-gray-500 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span>Last updated: {{ currentPricing()!.lastUpdated | date:'medium' }}</span>
                    <span>Updated by: {{ currentPricing()!.updatedBy }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AdPricingComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isLoading = signal(true);
  isSaving = signal(false);
  hasChanges = signal(false);
  currentPricing = signal<any>(null);

  pricingForm = new FormGroup({
    lineAdPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    posterAdPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    videoAdPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
    currency: new FormControl('INR'),
  });

  ngOnInit() {
    this.api.getAdPricing().subscribe({
      next: (data: any) => {
        this.currentPricing.set(data);
        this.pricingForm.patchValue({
          lineAdPrice: data.lineAdPrice || 0,
          posterAdPrice: data.posterAdPrice || 0,
          videoAdPrice: data.videoAdPrice || 0,
          currency: data.currency || 'INR',
        });
        this.isLoading.set(false);
        this.hasChanges.set(false);
      },
      error: () => { this.isLoading.set(false); this.notification.error('Failed to load ad pricing'); },
    });
    this.pricingForm.valueChanges.subscribe(() => this.hasChanges.set(true));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  }

  onSubmit() {
    if (this.pricingForm.invalid) return;
    this.isSaving.set(true);
    this.api.updateAdPricing(this.pricingForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.notification.success('Ad pricing updated successfully');
      },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update ad pricing'); },
    });
  }
}
