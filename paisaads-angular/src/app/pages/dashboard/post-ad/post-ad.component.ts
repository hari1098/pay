import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { AdService } from '../../../services/ad.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-post-ad',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatIcon, MatButtonToggleGroup, MatButtonToggle],
  templateUrl: './post-ad.html',
  styleUrl: './post-ad.css',
})
export class PostAdComponent implements OnInit {
  private readonly adService = inject(AdService);
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);
  readonly subCategories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal('');

  adType: 'LINE' | 'POSTER' | 'VIDEO' = 'LINE';

  content = '';
  title = '';
  imageUrl = '';
  videoUrl = '';
  mainCategory = '';
  categoryOne = '';
  state = '';
  city = '';
  contactOne = '';
  contactTwo = '';

  ngOnInit(): void {
    this.categoryService.getCategoriesTree().subscribe({
      next: (res) => this.categories.set(res.mainCategories ?? []),
      error: () => {},
    });
  }

  onMainCategoryChange(): void {
    const parent = this.categories().find(c => c.slug === this.mainCategory);
    this.subCategories.set(parent?.children ?? []);
    this.categoryOne = '';
  }

  onSubmit(): void {
    this.error.set('');
    this.success.set(false);

    if (!this.content || !this.mainCategory || !this.state || !this.city || !this.contactOne) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    this.loading.set(true);

    if (this.adType === 'LINE') {
      this.adService.createLineAd({
        content: this.content,
        mainCategory: this.mainCategory,
        categoryOne: this.categoryOne,
        state: this.state,
        city: this.city,
        contactOne: this.contactOne,
        contactTwo: this.contactTwo || undefined,
      }).subscribe({
        next: () => { this.success.set(true); this.loading.set(false); this.resetForm(); },
        error: (err) => { this.error.set(err.error?.message || 'Failed to post ad.'); this.loading.set(false); },
      });
    } else if (this.adType === 'POSTER') {
      this.adService.createPosterAd({
        title: this.title,
        content: this.content,
        imageUrl: this.imageUrl,
        mainCategory: this.mainCategory,
        categoryOne: this.categoryOne,
        state: this.state,
        city: this.city,
        contactOne: this.contactOne,
        contactTwo: this.contactTwo || undefined,
      }).subscribe({
        next: () => { this.success.set(true); this.loading.set(false); this.resetForm(); },
        error: (err) => { this.error.set(err.error?.message || 'Failed to post ad.'); this.loading.set(false); },
      });
    } else {
      this.adService.createVideoAd({
        title: this.title,
        content: this.content,
        videoUrl: this.videoUrl,
        mainCategory: this.mainCategory,
        categoryOne: this.categoryOne,
        state: this.state,
        city: this.city,
        contactOne: this.contactOne,
        contactTwo: this.contactTwo || undefined,
      }).subscribe({
        next: () => { this.success.set(true); this.loading.set(false); this.resetForm(); },
        error: (err) => { this.error.set(err.error?.message || 'Failed to post ad.'); this.loading.set(false); },
      });
    }
  }

  private resetForm(): void {
    this.content = '';
    this.title = '';
    this.imageUrl = '';
    this.videoUrl = '';
    this.mainCategory = '';
    this.categoryOne = '';
    this.state = '';
    this.city = '';
    this.contactOne = '';
    this.contactTwo = '';
    this.subCategories.set([]);
  }
}
