import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';
import { User, Role } from '../../shared/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside [class]="isSidebarOpen() ? 'translate-x-0' : '-translate-x-full'" class="w-64 bg-white border-r shadow-sm overflow-y-auto fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <div class="p-4 border-b">
          <a routerLink="/mgmt/dashboard" class="flex items-center">
            <span class="text-xl font-bold text-[#1a1a2e]">PaisaAds</span>
          </a>
        </div>
        <nav class="p-2">
          <ul class="space-y-1">
            @for (item of filteredMenuItems; track item.title) {
              <li>
                @if (item.submenu && item.submenu.length > 0) {
                  <div class="space-y-1">
                    <button (click)="toggleSubmenu(item.title)" class="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.bg-gray-100]="isItemActive(item.href)">
                      <span class="mr-3">{{ item.icon }}</span>
                      <span class="flex-1 text-left">{{ item.title }}</span>
                      <svg class="h-4 w-4" [class.rotate-180]="openSubmenu() === item.title" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    @if (openSubmenu() === item.title) {
                      <ul class="pl-9 space-y-1">
                        @for (sub of item.submenu; track sub.title) {
                          <li><a [routerLink]="sub.href" (click)="closeSidebar()" class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.bg-gray-100]="isItemActive(sub.href)">{{ sub.title }}</a></li>
                        }
                      </ul>
                    }
                  </div>
                } @else {
                  <a [routerLink]="item.href" (click)="closeSidebar()" class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100" [class.bg-gray-100]="isItemActive(item.href)">
                    <span class="mr-3">{{ item.icon }}</span>
                    {{ item.title }}
                  </a>
                }
              </li>
            }
          </ul>
        </nav>
      </aside>

      @if (isSidebarOpen()) {
        <div class="fixed inset-0 bg-black/50 z-40 md:hidden" (click)="closeSidebar()"></div>
      }

      <div class="flex flex-col flex-1 overflow-hidden md:ml-0">
        <header class="bg-white border-b px-6 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button class="md:hidden p-2 rounded-md hover:bg-gray-100" (click)="toggleSidebar()">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <h1 class="text-xl font-semibold">PaisaAds Admin</h1>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600">{{ user()?.name }}</span>
              <button (click)="onLogout()" class="text-sm text-red-500 hover:text-red-700">Logout</button>
            </div>
          </div>
        </header>
        <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  user = this.auth.currentUser;
  isSidebarOpen = signal(false);
  openSubmenu = signal<string | null>(null);

  menuItems = [
    { title: 'Dashboard', href: '/mgmt/dashboard', icon: '📊', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER] },
    { title: 'Reports', href: '/mgmt/dashboard/reports', icon: '📈', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER] },
    { title: 'Categories', href: '/mgmt/dashboard/categories', icon: '🏷', roles: [Role.SUPER_ADMIN], submenu: [
      { title: 'Add Categories', href: '/mgmt/dashboard/categories/add' },
      { title: 'View Categories', href: '/mgmt/dashboard/categories/view' },
    ]},
    { title: 'Configurations', href: '/mgmt/dashboard/configurations', icon: '⚙', roles: [Role.SUPER_ADMIN], submenu: [
      { title: 'Ad Pricing', href: '/mgmt/dashboard/configurations/ad-pricing' },
      { title: 'Privacy Policy', href: '/mgmt/dashboard/configurations/privacy-policy' },
      { title: 'Search Slogan', href: '/mgmt/dashboard/configurations/search-slogan' },
      { title: 'FAQ', href: '/mgmt/dashboard/configurations/faq' },
      { title: 'Contact Page', href: '/mgmt/dashboard/configurations/contact-page' },
      { title: 'Terms and Conditions', href: '/mgmt/dashboard/configurations/tc' },
    ]},
    { title: 'Review Ads', href: '/mgmt/dashboard/review-ads', icon: '📝', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER], submenu: [
      { title: 'Line Ads', href: '/mgmt/dashboard/review-ads/line' },
      { title: 'Poster Ads', href: '/mgmt/dashboard/review-ads/poster' },
      { title: 'Video Ads', href: '/mgmt/dashboard/review-ads/video' },
    ]},
    { title: 'Published Ads', href: '/mgmt/dashboard/published-ads', icon: '✅', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER], submenu: [
      { title: 'Line Ads', href: '/mgmt/dashboard/published-ads/line' },
      { title: 'Poster Ads', href: '/mgmt/dashboard/published-ads/poster' },
      { title: 'Video Ads', href: '/mgmt/dashboard/published-ads/video' },
    ]},
    { title: 'Ads On Hold', href: '/mgmt/dashboard/ads-on-hold', icon: '⏸', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER], submenu: [
      { title: 'Line Ads', href: '/mgmt/dashboard/ads-on-hold/line' },
      { title: 'Poster Ads', href: '/mgmt/dashboard/ads-on-hold/poster' },
      { title: 'Video Ads', href: '/mgmt/dashboard/ads-on-hold/video' },
    ]},
    { title: 'Rejected Ads', href: '/mgmt/dashboard/rejected-ads', icon: '❌', roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER], submenu: [
      { title: 'Line Ads', href: '/mgmt/dashboard/rejected-ads/line' },
      { title: 'Poster Ads', href: '/mgmt/dashboard/rejected-ads/poster' },
      { title: 'Video Ads', href: '/mgmt/dashboard/rejected-ads/video' },
    ]},
    { title: 'Users', href: '/mgmt/dashboard/users', icon: '👥', roles: [Role.SUPER_ADMIN] },
  ];

  filteredMenuItems: any[] = [];

  ngOnInit() {
    const userRole = this.user()?.role;
    this.filteredMenuItems = this.menuItems.filter(item => !item.roles || (userRole && item.roles.includes(userRole as Role)));
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) { this.isSidebarOpen.set(false); }
    });
  }

  toggleSubmenu(title: string) { this.openSubmenu.update(v => v === title ? null : title); }
  toggleSidebar() { this.isSidebarOpen.update(v => !v); }
  closeSidebar() { this.isSidebarOpen.set(false); }
  isItemActive(href: string): boolean { return this.router.url === href || this.router.url.startsWith(href + '/'); }

  onLogout() {
    this.auth.logout().subscribe(() => {
      this.notification.success('Logged out successfully');
      this.router.navigate(['/mgmt']);
    });
  }
}
