import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { User } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="h-screen">
      <header class="bg-white border-b px-6 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="lg:hidden p-2 rounded-md hover:bg-gray-100" (click)="toggleMobileMenu()">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h1 class="text-xl font-semibold">PaisaAds</h1>
          </div>
          <div class="relative">
            <button class="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1" (click)="toggleDropdown()">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1a2e]/10 text-[#1a1a2e] font-bold">{{ getInitials(user()?.name) }}</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            @if (isDropdownOpen()) {
              <div class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border p-2 z-50">
                <div class="px-3 py-2"><p class="text-sm font-medium">{{ user()?.name }}</p><p class="text-xs text-gray-500">{{ user()?.email }}</p></div>
                <hr class="my-1">
                <a routerLink="/dashboard/profile" class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100" (click)="isDropdownOpen.set(false)">Profile</a>
                <button class="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-500 w-full" (click)="onLogout()">Logout</button>
              </div>
            }
          </div>
        </div>
      </header>
      <div class="flex h-[calc(100vh-65px)]">
        <!-- Sidebar -->
        <aside class="hidden lg:block w-64 bg-white border-r shadow-sm overflow-y-auto">
          <nav class="p-4">
            <h2 class="text-lg font-medium mb-6">Menu</h2>
            <ul class="space-y-1">
              @for (item of menuItems; track item.title) {
                <li>
                  @if (item.submenu && item.submenu.length > 0) {
                    <div>
                      <button (click)="toggleSubmenu(item.title)" class="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.font-medium]="isItemActive(item.href)">
                        <span class="mr-3">{{ item.icon }}</span>
                        <span class="flex-1 text-left">{{ item.title }}</span>
                        <svg class="h-4 w-4 transition-transform" [class.rotate-90]="openSubmenu() === item.title" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                      </button>
                      @if (openSubmenu() === item.title) {
                        <ul class="pl-6 space-y-1">
                          @for (sub of item.submenu; track sub.title) {
                            <li><a [routerLink]="sub.href" class="block px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.font-medium]="isItemActive(sub.href)">{{ sub.title }}</a></li>
                          }
                        </ul>
                      }
                    </div>
                  } @else {
                    <a [routerLink]="item.href" class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.font-medium]="isItemActive(item.href)">
                      <span class="mr-3">{{ item.icon }}</span>
                      {{ item.title }}
                    </a>
                  }
                </li>
              }
            </ul>
          </nav>
        </aside>
        <!-- Mobile sidebar -->
        @if (isMobileMenuOpen()) {
          <div class="fixed inset-0 z-40 lg:hidden" (click)="isMobileMenuOpen.set(false)">
            <div class="fixed inset-0 bg-black/50"></div>
            <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-xl" (click)="$event.stopPropagation()">
              <nav class="p-4">
                <div class="flex justify-between items-center mb-6"><h2 class="text-lg font-medium">Menu</h2><button (click)="isMobileMenuOpen.set(false)" class="p-2 rounded hover:bg-gray-100">&times;</button></div>
                <ul class="space-y-1">
                  @for (item of menuItems; track item.title) {
                    <li>
                      @if (item.submenu && item.submenu.length > 0) {
                        <div>
                          <button (click)="toggleSubmenu(item.title)" class="flex items-center w-full px-3 py-2 text-sm">{{ item.title }} <svg class="h-4 w-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>
                          @if (openSubmenu() === item.title) {
                            <ul class="pl-6 space-y-1">
                              @for (sub of item.submenu; track sub.title) {
                                <li><a [routerLink]="sub.href" (click)="isMobileMenuOpen.set(false)" class="block px-3 py-2 text-sm">{{ sub.title }}</a></li>
                              }
                            </ul>
                          }
                        </div>
                      } @else {
                        <a [routerLink]="item.href" (click)="isMobileMenuOpen.set(false)" class="flex items-center px-3 py-2 text-sm">{{ item.title }}</a>
                      }
                    </li>
                  }
                </ul>
              </nav>
            </div>
          </div>
        }
        <main class="flex-1 h-full p-6 overflow-auto"><router-outlet /></main>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  user = this.auth.currentUser;
  isDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);
  openSubmenu = signal<string | null>(null);

  menuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: '📊', submenu: [] },
    { title: 'My Ads', href: '/dashboard/my-ads', icon: '✅', submenu: [
      { title: 'Line Ads', href: '/dashboard/my-ads/line-ads' },
      { title: 'Poster Ads', href: '/dashboard/my-ads/poster-ads' },
      { title: 'Video Ads', href: '/dashboard/my-ads/video-ads' },
    ]},
    { title: 'Post new Ad', href: '/dashboard/post-ad', icon: '📝', submenu: [
      { title: 'Line Ads', href: '/dashboard/post-ad/line-ad' },
      { title: 'Poster Ads', href: '/dashboard/post-ad/poster-ad' },
      { title: 'Video Ads', href: '/dashboard/post-ad/video-ad' },
    ]},
  ];

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { this.isMobileMenuOpen.set(false); }
    });
  }

  toggleSubmenu(title: string) {
    this.openSubmenu.update(v => v === title ? null : title);
  }
  toggleMobileMenu() { this.isMobileMenuOpen.update(v => !v); }
  toggleDropdown() { this.isDropdownOpen.update(v => !v); }

  isItemActive(href: string): boolean {
    return this.router.url === href || this.router.url.startsWith(href + '/');
  }

  getInitials(name?: string): string { return this.auth.getInitials(name); }

  onLogout() {
    this.auth.logout().subscribe(() => {
      this.notification.success('Logged out successfully');
      this.router.navigate(['/']);
    });
  }
}
