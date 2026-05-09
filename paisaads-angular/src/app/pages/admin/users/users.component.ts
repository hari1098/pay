import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, MatIconButton, MatIcon, MatProgressSpinner],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent extends ApiService implements OnInit {
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['name', 'email', 'phoneNumber', 'role', 'isActive', 'phoneVerified'];

  ngOnInit(): void {
    this.get<User[]>('/admin/users').subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleUserStatus(user: User): void {
    this.patch<void>(`/admin/users/${user.id}/toggle-status`, {}).subscribe({
      next: () => this.ngOnInit(),
      error: () => {},
    });
  }
}
