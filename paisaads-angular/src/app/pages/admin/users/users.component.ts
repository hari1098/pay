import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { User } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Users</h1>
      @if (isLoading()) {
        <div class="space-y-4">@for (i of [1,2,3]; track i) { <div class="h-16 bg-gray-100 rounded animate-pulse"></div> }</div>
      } @else {
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b"><tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{{ user.name }}</td>
                  <td class="px-4 py-3 text-sm">{{ user.email }}</td>
                  <td class="px-4 py-3 text-sm">{{ user.phone_number }}</td>
                  <td class="px-4 py-3 text-sm"><span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{{ user.role }}</span></td>
                  <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-medium" [class]="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ user.isActive ? 'Active' : 'Inactive' }}</span></td>
                  <td class="px-4 py-3 text-sm">
                    <button class="text-blue-600 hover:underline mr-2" (click)="toggleUserActivation(user)">{{ user.isActive ? 'Deactivate' : 'Activate' }}</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class UsersComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  users = signal<User[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (data) => { this.users.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  toggleUserActivation(user: User) {
    const action = user.isActive ? this.api.deactivateUser(user.id) : this.api.activateUser(user.id);
    action.subscribe({
      next: () => { this.notification.success(`User ${user.isActive ? 'deactivated' : 'activated'}`); this.ngOnInit(); },
      error: () => this.notification.error('Failed to update user'),
    });
  }
}
