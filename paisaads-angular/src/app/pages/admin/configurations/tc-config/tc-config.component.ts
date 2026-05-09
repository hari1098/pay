import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-tc-config',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="border rounded-lg shadow-sm">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">Terms and Conditions Configuration</h2>
        </div>
        <div class="p-6">
          @if (isLoading()) {
            <div class="space-y-4"><div class="h-10 bg-gray-100 rounded animate-pulse"></div><div class="h-64 bg-gray-100 rounded animate-pulse"></div></div>
          } @else {
            <form [formGroup]="tcForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium mb-1">Version</label><input type="text" formControlName="version" placeholder="e.g., 1.0" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <div><label class="block text-sm font-medium mb-1">Effective Date</label><input type="date" formControlName="effectiveDate" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Terms and Conditions Content (HTML)</label>
                <textarea formControlName="content" rows="16" placeholder="Enter terms and conditions content in HTML..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"></textarea>
              </div>
              <div class="flex justify-between items-center pt-4 border-t">
                <span class="text-sm text-gray-500">{{ hasChanges() ? 'Unsaved changes' : '' }}</span>
                <button type="submit" [disabled]="!hasChanges() || isSaving()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">
                  {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
            @if (currentTc()) {
              <div class="text-sm text-gray-500 border-t pt-4 mt-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><span class="font-medium">Current Version:</span> {{ currentTc()!.version }}</div>
                  <div><span class="font-medium">Effective Date:</span> {{ currentTc()!.effectiveDate | date:'mediumDate' }}</div>
                  <div><span class="font-medium">Last Updated:</span> {{ currentTc()!.lastUpdated | date:'mediumDate' }}</div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class TcConfigComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isLoading = signal(true);
  isSaving = signal(false);
  hasChanges = signal(false);
  currentTc = signal<any>(null);

  tcForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
    version: new FormControl('1.0', [Validators.required]),
    effectiveDate: new FormControl(new Date().toISOString().split('T')[0]),
  });

  ngOnInit() {
    this.api.getTermsAndConditions().subscribe({
      next: (data: any) => {
        this.currentTc.set(data);
        this.tcForm.patchValue({
          content: data.content || '',
          version: data.version || '1.0',
          effectiveDate: data.effectiveDate ? new Date(data.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
        this.isLoading.set(false);
        this.hasChanges.set(false);
      },
      error: () => { this.isLoading.set(false); },
    });
    this.tcForm.valueChanges.subscribe(() => this.hasChanges.set(true));
  }

  onSubmit() {
    if (this.tcForm.invalid) return;
    this.isSaving.set(true);
    this.api.updateTermsAndConditions(this.tcForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.notification.success('Terms and conditions updated successfully');
      },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update terms and conditions'); },
    });
  }
}
