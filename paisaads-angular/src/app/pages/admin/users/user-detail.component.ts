import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { User } from '../../../shared/models/models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6 max-w-3xl mx-auto">
      <a routerLink="/mgmt/dashboard/users" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Users</a>
      @if (isLoading()) {
        <div class="h-[300px] bg-gray-100 rounded animate-pulse"></div>
      } @else if (user()) {
        <div class="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">User Details</h1>
            <div class="flex gap-2">
              <button (click)="toggleActivation()" class="px-4 py-2 rounded-md text-sm font-medium" [class]="user()?.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'">
                {{ user()?.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p class="text-sm text-gray-500">Name</p><p class="font-medium">{{ user()!.name }}</p></div>
            <div><p class="text-sm text-gray-500">Email</p><p class="font-medium">{{ user()!.email }}</p></div>
            <div><p class="text-sm text-gray-500">Phone</p><p class="font-medium">{{ user()!.phone_number || '-' }}</p></div>
            <div><p class="text-sm text-gray-500">Role</p><p class="font-medium">{{ user()!.role }}</p></div>
            <div><p class="text-sm text-gray-500">Status</p>
              <span class="px-2 py-1 rounded-full text-xs font-medium" [class]="user()?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ user()?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div><p class="text-sm text-gray-500">Phone Verified</p>
              <span class="px-2 py-1 rounded-full text-xs font-medium" [class]="user()?.phone_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ user()?.phone_verified ? 'Verified' : 'Not Verified' }}
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class UserDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);
  user = signal<User | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.api.getUserById(id).subscribe({
      next: (data) => { this.user.set(data); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.notification.error('Failed to load user'); },
    });
  }

  toggleActivation() {
    const u = this.user();
    if (!u) return;
    const action = u.is_active ? this.api.deactivateUser(u.id) : this.api.activateUser(u.id);
    action.subscribe({
      next: () => {
        this.notification.success(u.is_active ? 'User deactivated' : 'User activated');
        this.user.update(usr => usr ? { ...usr, is_active: !usr.is_active } : null);
      },
      error: () => this.notification.error('Failed to update user status'),
    });
  }
}
