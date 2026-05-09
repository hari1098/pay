import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryTree } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg border shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">Add Category</h2>
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div><label class="block text-sm font-medium mb-1">Name</label><input type="text" formControlName="name" placeholder="Category name" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label class="block text-sm font-medium mb-1">Color</label><input type="color" formControlName="color" class="h-10 w-full rounded-md border border-input" /></div>
            <button type="submit" [disabled]="categoryForm.invalid || isSubmitting()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">{{ isSubmitting() ? 'Creating...' : 'Create Category' }}</button>
          </form>
        </div>
        <div class="bg-white rounded-lg border shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">Category Tree</h2>
          @if (categories().length > 0) {
            <ul class="space-y-2">
              @for (cat of categories(); track cat.id) {
                <li class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{{ cat.name }}</span>
                    <button (click)="deleteCategory(cat.id)" class="text-red-500 text-sm hover:underline">Delete</button>
                  </div>
                  @if (cat.children && cat.children.length > 0) {
                    <ul class="ml-4 mt-2 space-y-1">
                      @for (child of cat.children; track child.id) {
                        <li class="p-2 bg-white rounded border text-sm">{{ child.name }}</li>
                      }
                    </ul>
                  }
                </li>
              }
            </ul>
          } @else {
            <p class="text-gray-500">No categories found.</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  categories = signal<CategoryTree[]>([]);
  isSubmitting = signal(false);

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    color: new FormControl('#3B82F6'),
  });

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.api.getCategoryTree().subscribe(data => this.categories.set(data));
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    this.isSubmitting.set(true);
    this.api.createCategory(this.categoryForm.value).subscribe({
      next: () => { this.isSubmitting.set(false); this.notification.success('Category created'); this.categoryForm.reset({ color: '#3B82F6' }); this.loadCategories(); },
      error: () => { this.isSubmitting.set(false); this.notification.error('Failed to create category'); },
    });
  }

  deleteCategory(id: string) {
    this.api.deleteCategory(id).subscribe({
      next: () => { this.notification.success('Category deleted'); this.loadCategories(); },
      error: () => this.notification.error('Failed to delete category'),
    });
  }
}
