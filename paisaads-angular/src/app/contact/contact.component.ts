import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/services/api.service';
import { ContactInfo } from '../shared/models/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-container">
      <div class="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div class="contact-content">
        @if (loading()) {
          <div class="loading-spinner"></div>
        } @else if (error()) {
          <div class="error-message">{{ error() }}</div>
        } @else if (contactInfo()) {
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3>Email</h3>
              <p>{{ contactInfo()?.email }}</p>
            </div>
            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3>Phone</h3>
              <p>{{ contactInfo()?.phone }}</p>
            </div>
            <div class="info-card">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3>Address</h3>
              <p>{{ contactInfo()?.address }}</p>
              @if (contactInfo()?.city || contactInfo()?.state) {
                <p>{{ contactInfo()?.city }}{{ contactInfo()?.city && contactInfo()?.state ? ', ' : '' }}{{ contactInfo()?.state }}</p>
              }
            </div>
            @if (contactInfo()?.companyName) {
              <div class="info-card">
                <div class="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <h3>Company</h3>
                <p>{{ contactInfo()?.companyName }}</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .contact-container { max-width: 900px; margin: 0 auto; }
    .contact-hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      color: #fff;
      padding: 4rem 2rem;
      text-align: center;
    }
    .contact-hero h1 { font-size: 2.25rem; font-weight: 800; margin: 0 0 0.75rem; }
    .contact-hero p { font-size: 1.1rem; opacity: 0.85; margin: 0; }

    .contact-content { padding: 3rem 2rem; }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }
    .info-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.75rem;
      text-align: center;
      transition: all 0.2s;
    }
    .info-card:hover {
      border-color: #e94560;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    .info-icon {
      width: 56px; height: 56px;
      background: #eff6ff;
      color: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
    .info-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 0.5rem;
    }
    .info-card p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
      line-height: 1.5;
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
  `]
})
export class ContactComponent implements OnInit {
  private api = inject(ApiService);

  contactInfo = signal<ContactInfo | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.api.getContactInfo().subscribe({
      next: (data) => this.contactInfo.set(data),
      error: () => this.error.set('Failed to load contact information. Please try again later.'),
      complete: () => this.loading.set(false)
    });
  }
}
