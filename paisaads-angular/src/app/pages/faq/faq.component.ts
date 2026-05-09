import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { FaqData } from '../../shared/models/models';

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <div class="pt-20 px-4 pb-12">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
          @if (faqData()?.introduction) {
            <p class="text-lg text-gray-600 max-w-3xl mx-auto mt-4">{{ faqData()!.introduction }}</p>
          }
        </div>
        @if (isLoading()) {
          <div class="animate-pulse space-y-4"><div class="h-8 bg-gray-200 rounded w-1/3"></div><div class="h-4 bg-gray-200 rounded w-full"></div></div>
        } @else if (faqData() && filteredQuestions().length > 0) {
          @if (faqData()!.categories && faqData()!.categories!.length > 0) {
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                <h2 class="text-lg font-semibold">Filter by Category</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="px-3 py-1 text-sm rounded-md mb-2" [class]="selectedCategory() === '' ? 'bg-[#1a1a2e] text-white' : 'border'" (click)="selectedCategory.set('')">All Categories</button>
                @for (cat of faqData()!.categories; track cat) {
                  <button class="px-3 py-1 text-sm rounded-md mb-2" [class]="selectedCategory() === cat ? 'bg-[#1a1a2e] text-white' : 'border'" (click)="selectedCategory.set(cat)">{{ cat }}</button>
                }
              </div>
            </div>
          }
          <div class="bg-white rounded-lg border shadow-sm p-6 mb-8">
            @for (faq of filteredQuestions(); track $index) {
              <div class="border-b last:border-b-0">
                <button class="w-full text-left py-4 flex items-start gap-3" (click)="toggleFaq($index)">
                  <span class="px-2 py-0.5 rounded text-xs bg-gray-100">{{ faq.category }}</span>
                  <span class="flex-1">{{ faq.question }}</span>
                  <svg class="h-5 w-5 text-gray-400 transition-transform flex-shrink-0" [class.rotate-180]="openFaqIndex() === $index" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                @if (openFaqIndex() === $index) {
                  <div class="pb-4 text-gray-700" [innerHTML]="faq.answer"></div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12"><p class="text-gray-600">No FAQ questions available at the moment.</p></div>
        }
      </div>
    </div>
  `,
})
export class FaqComponent implements OnInit {
  private api = inject(ApiService);
  faqData = signal<FaqData | null>(null);
  isLoading = signal(true);
  selectedCategory = signal('');
  openFaqIndex = signal<number | null>(null);

  filteredQuestions = signal<any[]>([]);

  ngOnInit() {
    this.api.getFaq().subscribe({
      next: (data) => {
        this.faqData.set(data);
        this.isLoading.set(false);
        this.updateFiltered();
      },
      error: () => this.isLoading.set(false),
    });
    effect(() => { this.selectedCategory(); this.updateFiltered(); });
  }

  toggleFaq(index: number) {
    this.openFaqIndex.update(v => v === index ? null : index);
  }

  private updateFiltered() {
    const data = this.faqData();
    if (!data?.questions) { this.filteredQuestions.set([]); return; }
    const cat = this.selectedCategory();
    const filtered = data.questions.filter((q: any) => {
      if (!q.isActive) return false;
      if (!cat) return true;
      return q.category === cat;
    }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    this.filteredQuestions.set(filtered);
  }
}
