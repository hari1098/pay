import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-faq-config',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="border rounded-lg shadow-sm">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">FAQ Configuration</h2>
        </div>
        <div class="p-6">
          @if (isLoading()) {
            <div class="space-y-4">@for (i of [1,2,3,4,5]; track i) { <div class="h-20 bg-gray-100 rounded animate-pulse"></div> }</div>
          } @else {
            <div class="space-y-8">
              <div>
                <label class="block text-sm font-medium mb-1">FAQ Page Introduction</label>
                <textarea formControlName="introduction" rows="3" placeholder="Welcome to our FAQ section..." maxlength="500" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea>
                <div class="text-xs text-gray-500 mt-1">{{ faqForm.get('introduction')?.value?.length || 0 }}/500 characters</div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Categories</h3>
                <div class="flex flex-wrap gap-2">
                  @for (cat of categories(); track cat) {
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                      {{ cat }}
                      @if (categories().length > 1) {
                        <button (click)="removeCategory(cat)" class="text-red-400 hover:text-red-600">&times;</button>
                      }
                    </span>
                  }
                </div>
                <div class="flex gap-2">
                  <input type="text" #newCatInput placeholder="New category name" class="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  <button type="button" (click)="addCategory(newCatInput.value); newCatInput.value=''" class="h-10 px-4 rounded-md border text-sm font-medium">Add</button>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Help Contact</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium mb-1">Support Email</label><input type="email" formControlName="supportEmail" placeholder="support@example.com" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Support Phone</label><input type="tel" formControlName="supportPhone" placeholder="+1 (555) 123-4567" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">FAQ Questions</h3>
                  <button type="button" (click)="addQuestion()" class="h-9 px-4 rounded-md border text-sm font-medium">Add Question</button>
                </div>
                <div class="space-y-4">
                  @for (q of questions(); track $index) {
                    <div class="border rounded-lg p-4 space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium">#{{ $index + 1 }}</span>
                        <div class="flex items-center gap-2">
                          <label class="flex items-center gap-1 text-sm"><input type="checkbox" [checked]="q.isActive" (change)="updateQuestion($index, 'isActive', $any($event.target).checked)" /> Active</label>
                          <button type="button" (click)="moveQuestion($index, 'up')" [disabled]="$index === 0" class="text-sm px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">&uarr;</button>
                          <button type="button" (click)="moveQuestion($index, 'down')" [disabled]="$index === questions().length - 1" class="text-sm px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">&darr;</button>
                          <button type="button" (click)="removeQuestion($index)" class="text-red-500 text-sm px-2 py-1 rounded hover:bg-red-50">&times;</button>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium mb-1">Question</label><textarea [value]="q.question" (input)="updateQuestion($index, 'question', $any($event.target).value)" rows="2" placeholder="Enter the question..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea></div>
                        <div>
                          <label class="block text-sm font-medium mb-1">Category</label>
                          <select [value]="q.category" (change)="updateQuestion($index, 'category', $any($event.target).value)" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            @for (cat of categories(); track cat) { <option [value]="cat">{{ cat }}</option> }
                          </select>
                        </div>
                      </div>
                      <div><label class="block text-sm font-medium mb-1">Answer</label><textarea [value]="q.answer" (input)="updateQuestion($index, 'answer', $any($event.target).value)" rows="3" placeholder="Enter the detailed answer..." class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea></div>
                    </div>
                  }
                </div>
              </div>
              <div class="flex justify-between items-center pt-4 border-t">
                <span class="text-sm text-gray-500">{{ hasChanges() ? 'Unsaved changes' : '' }}</span>
                <button type="button" (click)="onSubmit()" [disabled]="!hasChanges() || isSaving()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">
                  {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
              @if (currentFaq()) {
                <div class="text-sm text-gray-500 border-t pt-4">
                  <div class="flex items-center justify-between">
                    <span>Last updated: {{ currentFaq()!.lastUpdated | date:'medium' }}</span>
                    <span>Updated by: {{ currentFaq()!.updatedBy }}</span>
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
export class FaqConfigComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isLoading = signal(true);
  isSaving = signal(false);
  hasChanges = signal(false);
  currentFaq = signal<any>(null);
  categories = signal<string[]>(['General']);
  questions = signal<any[]>([]);

  faqForm = new FormGroup({
    introduction: new FormControl(''),
    supportEmail: new FormControl(''),
    supportPhone: new FormControl(''),
  });

  ngOnInit() {
    this.api.getFaq().subscribe({
      next: (data: any) => {
        this.currentFaq.set(data);
        this.categories.set(data.categories || ['General']);
        this.questions.set((data.questions || []).sort((a: any, b: any) => a.order - b.order));
        this.faqForm.patchValue({
          introduction: data.introduction || '',
          supportEmail: data.contactInfo?.email || '',
          supportPhone: data.contactInfo?.phone || '',
        });
        this.isLoading.set(false);
        this.hasChanges.set(false);
      },
      error: () => { this.isLoading.set(false); },
    });
    this.faqForm.valueChanges.subscribe(() => this.hasChanges.set(true));
  }

  addCategory(name: string) {
    if (name.trim() && !this.categories().includes(name.trim())) {
      this.categories.update(cats => [...cats, name.trim()]);
      this.hasChanges.set(true);
    }
  }

  removeCategory(cat: string) {
    if (this.categories().length > 1) {
      this.categories.update(cats => cats.filter(c => c !== cat));
      this.hasChanges.set(true);
    }
  }

  addQuestion() {
    this.questions.update(qs => [...qs, { question: '', answer: '', category: this.categories()[0] || 'General', order: qs.length, isActive: true }]);
    this.hasChanges.set(true);
  }

  removeQuestion(index: number) {
    this.questions.update(qs => qs.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i })));
    this.hasChanges.set(true);
  }

  updateQuestion(index: number, field: string, value: any) {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    this.hasChanges.set(true);
  }

  moveQuestion(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= this.questions().length) return;
    this.questions.update(qs => {
      const updated = [...qs];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated.map((q, i) => ({ ...q, order: i }));
    });
    this.hasChanges.set(true);
  }

  onSubmit() {
    this.isSaving.set(true);
    const data = {
      ...this.faqForm.value,
      categories: this.categories(),
      questions: this.questions(),
      contactInfo: { email: this.faqForm.value.supportEmail, phone: this.faqForm.value.supportPhone },
    };
    this.api.updateFaq(data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.notification.success('FAQ updated successfully');
      },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update FAQ'); },
    });
  }
}
