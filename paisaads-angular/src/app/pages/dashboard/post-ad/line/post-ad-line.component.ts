import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CategoryTree } from '../../../../shared/models/models';

@Component({
  selector: 'app-post-ad-line',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Post Line Ad</h1>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <form [formGroup]="lineAdForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Main Category *</label>
                <select formControlName="mainCategoryId" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  @for (cat of flatCategories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Content *</label>
                <textarea formControlName="content" rows="4" placeholder="Ad content" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium mb-1">State *</label><input type="text" formControlName="state" placeholder="State" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <div><label class="block text-sm font-medium mb-1">City *</label><input type="text" formControlName="city" placeholder="City" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium mb-1">Posted By *</label><input type="text" formControlName="postedBy" placeholder="Posted by" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <div><label class="block text-sm font-medium mb-1">Contact One *</label><input type="tel" formControlName="contactOne" placeholder="Phone number" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Background Color</label>
                <input type="color" formControlName="backgroundColor" class="h-10 w-full rounded-md border border-input" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Text Color</label>
                <input type="color" formControlName="textColor" class="h-10 w-full rounded-md border border-input" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Images</label>
                <input type="file" multiple (change)="onFileSelect($event)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100" />
                <p class="text-xs text-gray-500 mt-1">Maximum 3 images</p>
              </div>
            </div>
          </div>
          <button type="submit" [disabled]="lineAdForm.invalid || isSubmitting()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
            {{ isSubmitting() ? 'Creating...' : 'Create Line Ad' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class PostAdLineComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  flatCategories = signal<{id: string; name: string}[]>([]);
  isSubmitting = signal(false);
  imageIds: string[] = [];

  lineAdForm = new FormGroup({
    mainCategoryId: new FormControl('', [Validators.required]),
    categoryOneId: new FormControl(''),
    categoryTwoId: new FormControl(''),
    categoryThreeId: new FormControl(''),
    content: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postedBy: new FormControl('', [Validators.required]),
    contactOne: new FormControl('', [Validators.required]),
    contactTwo: new FormControl(''),
    backgroundColor: new FormControl('#ffffff'),
    textColor: new FormControl('#000000'),
  });

  ngOnInit() {
    this.api.getCategoryTree().subscribe(data => {
      this.flatCategories.set(this.api.flattenCategories(data));
    });
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files.length > 3) { this.notification.error('Maximum 3 images allowed'); return; }
    for (let i = 0; i < files.length; i++) {
      this.api.uploadImage(files[i]).subscribe({
        next: (data: any) => this.imageIds.push(data.id),
        error: () => this.notification.error('Failed to upload image'),
      });
    }
  }

  onSubmit() {
    if (this.lineAdForm.invalid) return;
    this.isSubmitting.set(true);
    const formValue = { ...this.lineAdForm.value, imageIds: this.imageIds };
    this.api.createLineAd(formValue).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.success('Line ad created successfully');
        this.router.navigate(['/dashboard/my-ads/line-ads']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notification.error('Failed to create line ad');
      },
    });
  }
}
