import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { AuthService } from '../../shared/services/auth.service';
import { LineAd, PosterAd, VideoAd } from '../../shared/models/models';

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-ads-container">
      <div class="page-header">
        <h1>My Ads</h1>
        <a routerLink="/dashboard/post-ad" class="btn-post">Post New Ad</a>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs">
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'line'"
          (click)="switchTab('line')">
          Line Ads
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'poster'"
          (click)="switchTab('poster')">
          Poster Ads
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'video'"
          (click)="switchTab('video')">
          Video Ads
        </button>
      </div>

      @if (loading()) {
        <div class="loading-spinner"></div>
      } @else if (error()) {
        <div class="error-message">{{ error() }}</div>
      } @else {
        <!-- Line Ads Tab -->
        @if (activeTab() === 'line') {
          @if (lineAds().length === 0) {
            <div class="empty-state">
              <p>You haven't posted any line ads yet.</p>
              <a routerLink="/dashboard/post-ad" class="btn-link">Post your first ad</a>
            </div>
          } @else {
            <div class="table-wrapper">
              <table class="ads-table">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ad of lineAds(); track ad.id) {
                    <tr>
                      <td class="content-cell">{{ ad.content }}</td>
                      <td>{{ ad.mainCategory?.name }}</td>
                      <td>{{ ad.city }}, {{ ad.state }}</td>
                      <td><span class="badge" [class]="getStatusClass(ad.status)">{{ ad.status }}</span></td>
                      <td>{{ ad.createdAt | date:'shortDate' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }

        <!-- Poster Ads Tab -->
        @if (activeTab() === 'poster') {
          @if (posterAds().length === 0) {
            <div class="empty-state">
              <p>You haven't posted any poster ads yet.</p>
              <a routerLink="/dashboard/post-ad" class="btn-link">Post your first ad</a>
            </div>
          } @else {
            <div class="table-wrapper">
              <table class="ads-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ad of posterAds(); track ad.id) {
                    <tr>
                      <td>
                        @if (ad.image) {
                          <img [src]="ad.image.filePath" class="thumb" alt="poster" />
                        } @else {
                          <span class="no-image">No Image</span>
                        }
                      </td>
                      <td>{{ ad.mainCategory?.name }}</td>
                      <td>{{ ad.city }}, {{ ad.state }}</td>
                      <td><span class="badge" [class]="getStatusClass(ad.status)">{{ ad.status }}</span></td>
                      <td>{{ ad.createdAt | date:'shortDate' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }

        <!-- Video Ads Tab -->
        @if (activeTab() === 'video') {
          @if (videoAds().length === 0) {
            <div class="empty-state">
              <p>You haven't posted any video ads yet.</p>
              <a routerLink="/dashboard/post-ad" class="btn-link">Post your first ad</a>
            </div>
          } @else {
            <div class="table-wrapper">
              <table class="ads-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ad of videoAds(); track ad.id) {
                    <tr>
                      <td>
                        @if (ad.image) {
                          <img [src]="ad.image.filePath" class="thumb" alt="video" />
                        } @else {
                          <span class="no-image">No Thumbnail</span>
                        }
                      </td>
                      <td>{{ ad.mainCategory?.name }}</td>
                      <td>{{ ad.city }}, {{ ad.state }}</td>
                      <td><span class="badge" [class]="getStatusClass(ad.status)">{{ ad.status }}</span></td>
                      <td>{{ ad.createdAt | date:'shortDate' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
      }
    </div>
  `,
  styles: [`
    .my-ads-container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .page-header h1 { font-size: 1.75rem; font-weight: 800; color: #1a1a2e; margin: 0; }
    .btn-post {
      padding: 0.6rem 1.5rem;
      background: #e94560;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .btn-post:hover { background: #d63851; transform: translateY(-1px); }

    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
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
    .tab-btn:hover { color: #1a1a2e; }
    .tab-btn.active {
      color: #e94560;
      border-bottom-color: #e94560;
    }

    .table-wrapper { overflow-x: auto; }
    .ads-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    .ads-table th {
      background: #f9fafb;
      text-align: left;
      padding: 0.875rem 1rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ads-table td {
      padding: 0.875rem 1rem;
      border-top: 1px solid #f3f4f6;
      font-size: 0.9rem;
      color: #374151;
    }
    .ads-table tr:hover td { background: #fafbfc; }
    .content-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .thumb { width: 48px; height: 48px; border-radius: 0.375rem; object-fit: cover; }
    .no-image { font-size: 0.8rem; color: #9ca3af; font-style: italic; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-approved, .badge-active {
      background: #dcfce7;
      color: #16a34a;
    }
    .badge-pending {
      background: #fef3c7;
      color: #d97706;
    }
    .badge-rejected, .badge-inactive {
      background: #fef2f2;
      color: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #6b7280;
    }
    .empty-state p { margin: 0 0 1rem; font-size: 1.05rem; }
    .btn-link { color: #e94560; font-weight: 600; text-decoration: none; }
    .btn-link:hover { text-decoration: underline; }

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
  `]
})
export class MyAdsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'line' | 'poster' | 'video'>('line');
  lineAds = signal<LineAd[]>([]);
  posterAds = signal<PosterAd[]>([]);
  videoAds = signal<VideoAd[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    if (!this.auth.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAds();
  }

  switchTab(tab: 'line' | 'poster' | 'video'): void {
    this.activeTab.set(tab);
    this.loadAds();
  }

  private loadAds(): void {
    this.loading.set(true);
    this.error.set('');
    const tab = this.activeTab();

    const onError = () => this.error.set('Failed to load ads. Please try again.');
    const onComplete = () => this.loading.set(false);

    if (tab === 'line') {
      this.api.getMyLineAds().subscribe({
        next: (ads: any[]) => this.lineAds.set(ads),
        error: onError,
        complete: onComplete
      });
    } else if (tab === 'poster') {
      this.api.getMyPosterAds().subscribe({
        next: (ads: any[]) => this.posterAds.set(ads),
        error: onError,
        complete: onComplete
      });
    } else {
      this.api.getMyVideoAds().subscribe({
        next: (ads: any[]) => this.videoAds.set(ads),
        error: onError,
        complete: onComplete
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
        return 'badge-approved';
      case 'PENDING':
        return 'badge-pending';
      case 'REJECTED':
      case 'INACTIVE':
        return 'badge-rejected';
      default:
        return 'badge-pending';
    }
  }
}
