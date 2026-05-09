import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { Category } from '../../shared/models/models';

@Component({
  selector: 'app-post-ad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="post-ad-container">
      <div class="page-header">
        <h1>Post New Ad</h1>
        <a routerLink="/dashboard/my-ads" class="btn-back">Back to My Ads</a>
      </div>

      <!-- Ad Type Tabs -->
      <div class="type-tabs">
        <button
          class="type-tab"
          [class.active]="adType() === 'line'"
          (click)="switchType('line')">
          Line Ad
        </button>
        <button
          class="type-tab"
          [class.active]="adType() === 'poster'"
          (click)="switchType('poster')">
          Poster Ad
        </button>
        <button
          class="type-tab"
          [class.active]="adType() === 'video'"
          (click)="switchType('video')">
          Video Ad
        </button>
      </div>

      @if (errorMsg()) {
        <div class="alert alert-error">{{ errorMsg() }}</div>
      }
      @if (successMsg()) {
        <div class="alert alert-success">{{ successMsg() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="ad-form">
        <div class="form-row">
          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" [(ngModel)]="categoryId" name="category" class="form-control" required>
              <option value="">Select a category</option>
              @for (cat of categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
                @for (sub of (cat.children ?? cat.subCategories ?? []); track sub.id) {
                  <option [value]="sub.id">&nbsp;&nbsp;-- {{ sub.name }}</option>
                }
              }
            </select>
          </div>
        </div>

        @if (adType() === 'line') {
          <div class="form-group">
            <label for="content">Ad Content *</label>
            <textarea
              id="content"
              [(ngModel)]="content"
              name="content"
              class="form-control form-textarea"
              placeholder="Enter your ad content here..."
              rows="4"
              required
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="contactOne">Contact Number 1 *</label>
              <input id="contactOne" type="tel" [(ngModel)]="contactOne" name="contactOne" class="form-control" placeholder="Primary contact number" required />
            </div>
            <div class="form-group">
              <label for="contactTwo">Contact Number 2 (optional)</label>
              <input id="contactTwo" type="tel" [(ngModel)]="contactTwo" name="contactTwo" class="form-control" placeholder="Secondary contact number" />
            </div>
          </div>
        }

        <div class="form-row">
          <div class="form-group">
            <label for="state">State *</label>
            <input id="state" type="text" [(ngModel)]="state" name="state" class="form-control" placeholder="e.g. Maharashtra" required />
          </div>
          <div class="form-group">
            <label for="city">City *</label>
            <input id="city" type="text" [(ngModel)]="city" name="city" class="form-control" placeholder="e.g. Mumbai" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input id="startDate" type="date" [(ngModel)]="startDate" name="startDate" class="form-control" />
          </div>
          <div class="form-group">
            <label for="endDate">End Date</label>
            <input id="endDate" type="date" [(ngModel)]="endDate" name="endDate" class="form-control" />
          </div>
        </div>

        <button type="submit" class="btn-submit" [disabled]="submitting()">
          @if (submitting()) {
            <span class="spinner"></span> Submitting...
          } @else {
            Submit Ad
          }
        </button>
      </form>
    </div>
  `,
  styles: [`
    .post-ad-container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .page-header h1 { font-size: 1.75rem; font-weight: 800; color: #1a1a2e; margin: 0; }
    .btn-back {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-back:hover { text-decoration: underline; }

    .type-tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 1.5rem;
    }
    .type-tab {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      font-size: 0.95rem;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .type-tab:hover { color: #1a1a2e; }
    .type-tab.active { color: #e94560; border-bottom-color: #e94560; }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
    }
    .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

    .ad-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: flex; gap: 1.25rem; }
    .form-group { flex: 1; display: flex; flex-direction: column; }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
    }
    .form-control {
      padding: 0.7rem 0.875rem;
      border: 1.5px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #e94560;
      box-shadow: 0 0 0 3px rgba(233,69,96,0.15);
    }
    .form-textarea { resize: vertical; min-height: 100px; }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) { background: #d63851; transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .form-row { flex-direction: column; gap: 1.25rem; }
    }
  `]
})
export class PostAdComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  adType = signal<'line' | 'poster' | 'video'>('line');
  categories = signal<Category[]>([]);
  loading = signal(true);
  submitting = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  // Form fields
  categoryId = '';
  content = '';
  state = '';
  city = '';
  contactOne = '';
  contactTwo = '';
  startDate = '';
  endDate = '';

  ngOnInit(): void {
    if (!this.auth.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.getCategoryTree().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.errorMsg.set('Failed to load categories.'),
      complete: () => this.loading.set(false)
    });
  }

  switchType(type: 'line' | 'poster' | 'video'): void {
    this.adType.set(type);
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  onSubmit(): void {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.categoryId || !this.state || !this.city) {
      this.errorMsg.set('Category, state, and city are required.');
      return;
    }

    if (this.adType() === 'line' && (!this.content || !this.contactOne)) {
      this.errorMsg.set('Content and primary contact number are required for line ads.');
      return;
    }

    this.submitting.set(true);
    const dates: string[] = [];
    if (this.startDate) dates.push(this.startDate);
    if (this.endDate) dates.push(this.endDate);

    const baseData = {
      mainCategory: this.categoryId,
      state: this.state,
      city: this.city,
      dates
    };

    const type = this.adType();

    if (type === 'line') {
      const data = {
        ...baseData,
        content: this.content,
        contactOne: this.contactOne,
        contactTwo: this.contactTwo || undefined
      };
      this.api.createLineAd(data).subscribe({
        next: () => {
          this.successMsg.set('Line ad submitted successfully! It will be reviewed shortly.');
          this.resetForm();
        },
        error: (err) => this.errorMsg.set(err?.error?.message || 'Failed to submit line ad.'),
        complete: () => this.submitting.set(false)
      });
    } else if (type === 'poster') {
      this.api.createPosterAd(baseData).subscribe({
        next: () => {
          this.successMsg.set('Poster ad submitted successfully! It will be reviewed shortly.');
          this.resetForm();
        },
        error: (err) => this.errorMsg.set(err?.error?.message || 'Failed to submit poster ad.'),
        complete: () => this.submitting.set(false)
      });
    } else {
      this.api.createVideoAd(baseData).subscribe({
        next: () => {
          this.successMsg.set('Video ad submitted successfully! It will be reviewed shortly.');
          this.resetForm();
        },
        error: (err) => this.errorMsg.set(err?.error?.message || 'Failed to submit video ad.'),
        complete: () => this.submitting.set(false)
      });
    }
  }

  private resetForm(): void {
    this.categoryId = '';
    this.content = '';
    this.state = '';
    this.city = '';
    this.contactOne = '';
    this.contactTwo = '';
    this.startDate = '';
    this.endDate = '';
  }
}
