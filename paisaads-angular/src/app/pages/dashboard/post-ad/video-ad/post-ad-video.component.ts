import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-post-ad-video',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Post Video Ad</h1>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <form [formGroup]="videoAdForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Main Category *</label>
                <select formControlName="mainCategoryId" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  @for (cat of flatCategories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium mb-1">State *</label><input type="text" formControlName="state" placeholder="State" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <div><label class="block text-sm font-medium mb-1">City *</label><input type="text" formControlName="city" placeholder="City" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium mb-1">Posted By *</label><input type="text" formControlName="postedBy" placeholder="Posted by" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                <div><label class="block text-sm font-medium mb-1">Contact One *</label><input type="tel" formControlName="contactOne" placeholder="Phone number" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              </div>
              <div><label class="block text-sm font-medium mb-1">Contact Two</label><input type="tel" formControlName="contactTwo" placeholder="Alternate phone" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Ad Title *</label>
                <input type="text" formControlName="title" placeholder="Ad title" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Video File *</label>
                <input type="file" accept="video/*" (change)="onVideoSelect($event)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100" />
                <p class="text-xs text-gray-500 mt-1">Upload video file</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Thumbnail Image</label>
                <input type="file" accept="image/*" (change)="onThumbnailSelect($event)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Video URL (if not uploading)</label>
                <input type="url" formControlName="videoUrl" placeholder="https://example.com/video.mp4" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Position</label>
                <select formControlName="position" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="CENTER">Center</option>
                  <option value="LEFT">Left</option>
                  <option value="RIGHT">Right</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" [disabled]="videoAdForm.invalid || isSubmitting()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
            {{ isSubmitting() ? 'Creating...' : 'Create Video Ad' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class PostAdVideoComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  flatCategories = signal<{id: string; name: string}[]>([]);
  isSubmitting = signal(false);
  videoMediaId = '';
  thumbnailMediaId = '';

  videoAdForm = new FormGroup({
    mainCategoryId: new FormControl('', [Validators.required]),
    categoryOneId: new FormControl(''),
    categoryTwoId: new FormControl(''),
    categoryThreeId: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postedBy: new FormControl('', [Validators.required]),
    contactOne: new FormControl('', [Validators.required]),
    contactTwo: new FormControl(''),
    videoUrl: new FormControl(''),
    position: new FormControl('CENTER'),
  });

  ngOnInit() {
    this.api.getCategoryTree().subscribe(data => {
      this.flatCategories.set(this.api.flattenCategories(data));
    });
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.api.uploadImage(file).subscribe({
        next: (data: any) => this.videoMediaId = data.id,
        error: () => this.notification.error('Failed to upload video'),
      });
    }
  }

  onThumbnailSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.api.uploadImage(file).subscribe({
        next: (data: any) => this.thumbnailMediaId = data.id,
        error: () => this.notification.error('Failed to upload thumbnail'),
      });
    }
  }

  onSubmit() {
    if (this.videoAdForm.invalid) return;
    this.isSubmitting.set(true);
    const formValue: any = {
      ...this.videoAdForm.value,
      videoMediaId: this.videoMediaId,
      thumbnailMediaId: this.thumbnailMediaId,
    };
    this.api.createVideoAd(formValue).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.success('Video ad created successfully');
        this.router.navigate(['/dashboard/my-ads/video-ads']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notification.error('Failed to create video ad');
      },
    });
  }
}
