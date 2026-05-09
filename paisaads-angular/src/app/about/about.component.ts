import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <div class="about-hero">
        <h1>About PaisaAds</h1>
        <p>India's trusted classified ads platform</p>
      </div>

      <div class="about-content">
        @if (loading()) {
          <div class="loading-spinner"></div>
        } @else if (error()) {
          <div class="error-message">{{ error() }}</div>
        } @else {
          <div class="content-card" [innerHTML]="content()"></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .about-container { max-width: 900px; margin: 0 auto; }
    .about-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      color: #fff;
      padding: 4rem 2rem;
      text-align: center;
    }
    .about-hero h1 { font-size: 2.25rem; font-weight: 800; margin: 0 0 0.75rem; }
    .about-hero p { font-size: 1.1rem; opacity: 0.85; margin: 0; }

    .about-content { padding: 3rem 2rem; }
    .content-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 2rem;
      line-height: 1.8;
      color: #374151;
      font-size: 1rem;
    }
    .content-card ::ng-deep h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 1.5rem 0 0.75rem;
    }
    .content-card ::ng-deep h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 1.25rem 0 0.5rem;
    }
    .content-card ::ng-deep p { margin: 0 0 1rem; }
    .content-card ::ng-deep ul, .content-card ::ng-deep ol {
      padding-left: 1.5rem;
      margin: 0 0 1rem;
    }
    .content-card ::ng-deep li { margin-bottom: 0.5rem; }

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
  `]
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);

  content = signal('');
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.api.getAboutUs().subscribe({
      next: (data) => this.content.set(data.content),
      error: () => this.error.set('Failed to load about us content. Please try again later.'),
      complete: () => this.loading.set(false)
    });
  }
}
