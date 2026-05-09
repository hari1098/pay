import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryTree } from '../../../shared/models/models';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold">Add Category</h1>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Category Name *</label>
            <input type="text" formControlName="name" placeholder="Category name" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Parent Category</label>
            <select formControlName="parentId" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">None (Top-level)</option>
              @for (cat of flatCategories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Color</label>
            <input type="color" formControlName="color" class="h-10 w-full rounded-md border border-input" />
          </div>
          <button type="submit" [disabled]="categoryForm.invalid || isSubmitting()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
            {{ isSubmitting() ? 'Creating...' : 'Create Category' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class AddCategoryComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  flatCategories = signal<{id: string; name: string}[]>([]);
  isSubmitting = signal(false);

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    parentId: new FormControl(''),
    color: new FormControl('#1a1a2e'),
  });

  ngOnInit() {
    this.api.getCategoryTree().subscribe(data => {
      this.flatCategories.set(this.api.flattenCategories(data));
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.isSubmitting.set(true);
    this.api.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.success('Category created successfully');
        this.router.navigate(['/mgmt/dashboard/categories/view']);
      },
      error: () => { this.isSubmitting.set(false); this.notification.error('Failed to create category'); },
    });
  }
}
