import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ApiService } from '../shared/services/api.service';
import { DashboardStats } from '../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (!auth.currentUserValue) {
      <div class="redirect-notice">Redirecting to login...</div>
    } @else {
      <div class="dashboard-container">
        <!-- Welcome Section -->
        <div class="welcome-banner">
          <div class="welcome-content">
            <h1>Welcome back, {{ auth.currentUserValue?.name || 'User' }}!</h1>
            <p>Manage your ads and track their performance</p>
          </div>
          <div class="welcome-actions">
            <a routerLink="/dashboard/post-ad" class="btn btn-primary">Post New Ad</a>
            <a routerLink="/dashboard/my-ads" class="btn btn-outline">My Ads</a>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalAds ?? '-' }}</span>
              <span class="stat-label">Total Ads</span>
            </div>
          </div>
          <div class="stat-card stat-active">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.activeAds ?? '-' }}</span>
              <span class="stat-label">Active Ads</span>
            </div>
          </div>
          <div class="stat-card stat-pending">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.pendingAds ?? '-' }}</span>
              <span class="stat-label">Pending Ads</span>
            </div>
          </div>
          <div class="stat-card stat-views">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.totalViews ?? '-' }}</span>
              <span class="stat-label">Total Views</span>
            </div>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-spinner"></div>
        }
        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/dashboard/my-ads" class="action-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              <span>Manage My Ads</span>
            </a>
            <a routerLink="/dashboard/post-ad" class="action-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Post a New Ad</span>
            </a>
            <a routerLink="/search" class="action-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Search Ads</span>
            </a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .redirect-notice {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #6b7280;
    }
    .dashboard-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: #fff;
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .welcome-content h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.5rem; }
    .welcome-content p { margin: 0; opacity: 0.85; }
    .welcome-actions { display: flex; gap: 0.75rem; }
    .btn {
      padding: 0.6rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary { background: #e94560; color: #fff; border: none; }
    .btn-primary:hover { background: #d63851; }
    .btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5); }
    .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #fff;
      padding: 1.25rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
      transition: box-shadow 0.2s;
    }
    .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .stat-icon {
      width: 52px; height: 52px;
      border-radius: 0.75rem;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-total .stat-icon { background: #eff6ff; color: #3b82f6; }
    .stat-active .stat-icon { background: #f0fdf4; color: #22c55e; }
    .stat-pending .stat-icon { background: #fef3c7; color: #f59e0b; }
    .stat-views .stat-icon { background: #faf5ff; color: #a855f7; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; }
    .stat-label { font-size: 0.8rem; color: #6b7280; font-weight: 500; }

    .quick-actions h2 { font-size: 1.25rem; font-weight: 700; color: #1a1a2e; margin: 0 0 1rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
    .action-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      text-decoration: none;
      color: #1a1a2e;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .action-card:hover {
      border-color: #e94560;
      color: #e94560;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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
    .error-message { text-align: center; color: #dc2626; padding: 1rem; }

    @media (max-width: 768px) {
      .welcome-banner { flex-direction: column; text-align: center; }
      .welcome-actions { justify-content: center; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    if (!this.auth.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.api.getUserDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard data.');
        this.loading.set(false);
      }
    });
  }
}
