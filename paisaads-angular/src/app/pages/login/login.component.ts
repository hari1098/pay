import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, MatButton, MatFormField, MatLabel, MatInput, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  phoneNumber = '';
  password = '';
  hidePassword = true;

  onSubmit(): void {
    this.error.set('');

    if (!this.phoneNumber || !this.password) {
      this.error.set('Phone number and password are required.');
      return;
    }

    this.loading.set(true);

    this.auth.login(this.phoneNumber, this.password).subscribe({
      next: (response) => {
        this.auth.handleAuthSuccess(response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
      },
    });
  }
}
