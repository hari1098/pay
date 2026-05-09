import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-search-slogan',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="border rounded-lg shadow-sm">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">Search Page Slogan Configuration</h2>
        </div>
        <div class="p-6">
          @if (isLoading()) {
            <div class="space-y-4"><div class="h-10 bg-gray-100 rounded animate-pulse"></div><div class="h-20 bg-gray-100 rounded animate-pulse"></div></div>
          } @else {
            <div class="space-y-6">
              @if (currentSlogan()) {
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold text-blue-900">{{ currentSlogan()!.primarySlogan }}</h2>
                    @if (currentSlogan()!.secondarySlogan) {
                      <p class="text-blue-700 text-lg">{{ currentSlogan()!.secondarySlogan }}</p>
                    }
                    <span class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mt-2">Current Active Slogan</span>
                  </div>
                </div>
              }
              <form [formGroup]="sloganForm" (ngSubmit)="onSubmit()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Primary Slogan</label>
                  <input type="text" formControlName="primarySlogan" placeholder="Enter primary slogan" maxlength="100" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  <div class="text-xs text-gray-500 mt-1">{{ sloganForm.get('primarySlogan')?.value?.length || 0 }}/100 characters</div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Secondary Slogan (Optional)</label>
                  <textarea formControlName="secondarySlogan" rows="3" placeholder="Enter secondary slogan" maxlength="200" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea>
                  <div class="text-xs text-gray-500 mt-1">{{ sloganForm.get('secondarySlogan')?.value?.length || 0 }}/200 characters</div>
                </div>
                <div class="flex justify-between items-center pt-4 border-t">
                  <span class="text-sm text-gray-500">{{ hasChanges() ? 'Unsaved changes' : '' }}</span>
                  <button type="submit" [disabled]="!hasChanges() || isSaving() || !sloganForm.get('primarySlogan')?.value?.trim()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">
                    {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
              @if (currentSlogan()) {
                <div class="text-sm text-gray-500 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span>Last updated: {{ currentSlogan()!.lastUpdated | date:'medium' }}</span>
                    <span>Updated by: {{ currentSlogan()!.updatedBy }}</span>
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
export class SearchSloganComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isLoading = signal(true);
  isSaving = signal(false);
  hasChanges = signal(false);
  currentSlogan = signal<any>(null);

  sloganForm = new FormGroup({
    primarySlogan: new FormControl('', [Validators.required]),
    secondarySlogan: new FormControl(''),
  });

  ngOnInit() {
    this.api.getSearchSlogan().subscribe({
      next: (data: any) => {
        this.currentSlogan.set(data);
        this.sloganForm.patchValue({
          primarySlogan: data.primarySlogan || '',
          secondarySlogan: data.secondarySlogan || '',
        });
        this.isLoading.set(false);
        this.hasChanges.set(false);
      },
      error: () => { this.isLoading.set(false); },
    });
    this.sloganForm.valueChanges.subscribe(() => this.hasChanges.set(true));
  }

  onSubmit() {
    if (this.sloganForm.invalid) return;
    this.isSaving.set(true);
    this.api.updateSearchSlogan(this.sloganForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.notification.success('Search slogan updated successfully');
      },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update search slogan'); },
    });
  }
}
