import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal('');

  name = this.auth.currentUser()?.name ?? '';
  email = this.auth.currentUser()?.email ?? '';
  phoneNumber = this.auth.currentUser()?.phoneNumber ?? '';

  onSubmit(): void {
    this.error.set('');
    this.success.set(false);
    this.loading.set(true);

    this.auth.getProfile().subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to update profile.');
        this.loading.set(false);
      },
    });
  }
}
