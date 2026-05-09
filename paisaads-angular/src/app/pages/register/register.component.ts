import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mx-auto container max-w-3xl py-8 px-4">
      <div class="bg-white rounded-lg border shadow-sm">
        <div class="p-6 space-y-1">
          <h2 class="text-lg font-semibold">Fill in your details to create a new account</h2>
        </div>
        <div class="p-6 pt-0">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <input type="text" formControlName="name" placeholder="Full name" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  @if (registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched) {
                    <p class="text-xs text-red-500 mt-1">Name is required</p>
                  }
                </div>
                <div>
                  <input type="email" formControlName="email" placeholder="Email" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                    <p class="text-xs text-red-500 mt-1">Email is required</p>
                  }
                </div>
                <div>
                  <input type="tel" formControlName="phone_number" placeholder="Phone number" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <input type="tel" formControlName="secondary_number" placeholder="Secondary Phone number" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  <p class="text-xs text-gray-500 mt-1">This number will be used for ads if provided.</p>
                </div>
                <div>
                  <input type="password" formControlName="password" placeholder="Password" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                    <p class="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
                  }
                </div>
                <div>
                  <input type="password" formControlName="confirm_password" placeholder="Confirm Password" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Gender</label>
                  <div class="flex space-x-4">
                    <label class="flex items-center space-x-2"><input type="radio" formControlName="gender" value="0" /><span>Male</span></label>
                    <label class="flex items-center space-x-2"><input type="radio" formControlName="gender" value="1" /><span>Female</span></label>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <input type="text" formControlName="country" placeholder="Country" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <input type="text" formControlName="state" placeholder="State" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <input type="text" formControlName="city" placeholder="City" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="text-xs block mb-1">ID proof (Aadhar card, Drivers license, voter id, etc.)</label>
                  <input type="file" (change)="onFileSelect($event)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                  @if (isUploading()) {
                    <p class="text-xs text-blue-500 mt-1">Uploading...</p>
                  }
                </div>
              </div>
            </div>
            <button type="submit" [disabled]="registerForm.invalid || isSubmitting() || isUploading()" class="w-full h-10 bg-[#1a1a2e] text-white rounded-md px-4 font-medium disabled:opacity-50">
              {{ isSubmitting() ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  isSubmitting = signal(false);
  isUploading = signal(false);
  proofId = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone_number: new FormControl('', [Validators.required, Validators.minLength(10)]),
    secondary_number: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirm_password: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    gender: new FormControl(0),
    country_id: new FormControl(101),
    state_id: new FormControl(0),
    city_id: new FormControl(0),
    proof: new FormControl(''),
  });

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      this.api.uploadImage(file).subscribe({
        next: (data: any) => {
          this.proofId = data.id;
          this.registerForm.patchValue({ proof: data.id });
          this.isUploading.set(false);
          this.notification.success('Proof document uploaded successfully');
        },
        error: () => {
          this.isUploading.set(false);
          this.notification.error('Failed to upload proof document');
        },
      });
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    if (this.registerForm.value.password !== this.registerForm.value.confirm_password) {
      this.notification.error('Passwords do not match');
      return;
    }
    this.isSubmitting.set(true);
    const { confirm_password, ...registrationData } = this.registerForm.value;
    this.api.register(registrationData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.success('Account created successfully', 'Please login to verify your phone number');
        this.router.navigate(['/']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notification.error('Registration failed', 'Phone number or email address already in use.');
      },
    });
  }
}
