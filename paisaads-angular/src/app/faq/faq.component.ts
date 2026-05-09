import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/services/api.service';
import { FaqItem } from '../shared/models/models';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-container">
      <div class="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions</p>
      </div>

      <div class="faq-content">
        @if (loading()) {
          <div class="loading-spinner"></div>
        } @else if (error()) {
          <div class="error-message">{{ error() }}</div>
        } @else if (faqItems().length === 0) {
          <div class="empty-state">No FAQs available at this time.</div>
        } @else {
          <div class="faq-list">
            @for (item of faqItems(); track $index) {
              <div class="faq-item" [class.open]="isOpen($index)">
                <button class="faq-question" (click)="toggleItem($index)">
                  <span>{{ item.question }}</span>
                  <span class="faq-toggle">{{ isOpen($index) ? '-' : '+' }}</span>
                </button>
                @if (isOpen($index)) {
                  <div class="faq-answer">
                    <p>{{ item.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .faq-container { max-width: 800px; margin: 0 auto; }
    .faq-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      color: #fff;
      padding: 4rem 2rem;
      text-align: center;
    }
    .faq-hero h1 { font-size: 2.25rem; font-weight: 800; margin: 0 0 0.75rem; }
    .faq-hero p { font-size: 1.1rem; opacity: 0.85; margin: 0; }

    .faq-content { padding: 3rem 2rem; }
    .faq-list { display: flex; flex-direction: column; gap: 0.75rem; }

    .faq-item {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.2s;
    }
    .faq-item.open { border-color: #e94560; box-shadow: 0 2px 8px rgba(233,69,96,0.1); }

    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a2e;
      text-align: left;
      transition: all 0.2s;
    }
    .faq-question:hover { color: #e94560; }
    .faq-toggle {
      font-size: 1.25rem;
      font-weight: 700;
      color: #e94560;
      min-width: 20px;
      text-align: center;
    }

    .faq-answer {
      padding: 0 1.5rem 1.25rem;
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
    .faq-answer p {
      margin: 0;
      color: #4b5563;
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .loading-spinner {
      width: 40px; height: 40px;
      border: 4px solid #e5e7eb;
      border-top-color: #e94560;
      border-radius: 50%;
      margin: 2rem auto;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-message { text-align: center; color: #dc2626; padding: 2rem; }
    .empty-state { text-align: center; color: #6b7280; padding: 2rem; }
  `]
})
export class FaqComponent implements OnInit {
  private api = inject(ApiService);

  faqItems = signal<FaqItem[]>([]);
  openItems = signal<Set<number>>(new Set());
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.api.getFaq().subscribe({
      next: (data) => this.faqItems.set(data.questions ?? []),
      error: () => this.error.set('Failed to load FAQs. Please try again later.'),
      complete: () => this.loading.set(false)
    });
  }

  toggleItem(index: number): void {
    const current = new Set(this.openItems());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.openItems.set(current);
  }

  isOpen(index: number): boolean {
    return this.openItems().has(index);
  }
}
