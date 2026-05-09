import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ApiService } from '../../../shared/services/api.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold">My Profile</h1>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
        <form [formGroup]="profileForm" (ngSubmit)="onProfileSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium mb-1">Name</label><input type="text" formControlName="name" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            <div><label class="block text-sm font-medium mb-1">Email</label><input type="email" formControlName="email" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>
          <button type="submit" [disabled]="profileForm.invalid || isSaving()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">{{ isSaving() ? 'Saving...' : 'Save Changes' }}</button>
        </form>
      </div>
      <div class="bg-white rounded-lg border shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Change Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="space-y-4">
          <div><label class="block text-sm font-medium mb-1">Current Password</label><input type="password" formControlName="currentPassword" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium mb-1">New Password</label><input type="password" formControlName="newPassword" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium mb-1">Confirm Password</label><input type="password" formControlName="confirmPassword" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          <button type="submit" [disabled]="passwordForm.invalid || isChangingPassword()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">{{ isChangingPassword() ? 'Changing...' : 'Change Password' }}</button>
        </form>
      </div>
    </div>
  `,
})
export class AdminProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isSaving = signal(false);
  isChangingPassword = signal(false);

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) { this.profileForm.patchValue({ name: user.name, email: user.email }); }
  }

  onProfileSubmit() {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);
    this.api.updateProfile(this.profileForm.value).subscribe({
      next: () => { this.isSaving.set(false); this.notification.success('Profile updated'); },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update profile'); },
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) { this.notification.error('Passwords do not match'); return; }
    this.isChangingPassword.set(true);
    this.api.changePassword(this.passwordForm.value).subscribe({
      next: () => { this.isChangingPassword.set(false); this.notification.success('Password changed'); this.passwordForm.reset(); },
      error: () => { this.isChangingPassword.set(false); this.notification.error('Failed to change password'); },
    });
  }
}
