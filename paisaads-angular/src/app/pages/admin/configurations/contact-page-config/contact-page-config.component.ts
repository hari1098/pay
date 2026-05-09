import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../../shared/services/api.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-contact-page-config',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="border rounded-lg shadow-sm">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold">Contact Page Configuration</h2>
        </div>
        <div class="p-6">
          @if (isLoading()) {
            <div class="space-y-4">@for (i of [1,2,3,4,5,6,7,8]; track i) { <div class="h-16 bg-gray-100 rounded animate-pulse"></div> }</div>
          } @else {
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Company Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium mb-1">Company Name</label><input type="text" formControlName="companyName" placeholder="Company name" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Website URL</label><input type="url" formControlName="websiteUrl" placeholder="https://www.yourcompany.com" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                </div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Contact Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium mb-1">Primary Email</label><input type="email" formControlName="email" placeholder="contact@company.com" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Primary Phone</label><input type="tel" formControlName="phone" placeholder="+1 (555) 123-4567" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Support Email</label><input type="email" formControlName="supportEmail" placeholder="support@company.com" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Sales Email</label><input type="email" formControlName="salesEmail" placeholder="sales@company.com" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Alternate Phone</label><input type="tel" formControlName="alternatePhone" placeholder="+1 (555) 987-6543" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Emergency Contact</label><input type="tel" formControlName="emergencyContact" placeholder="+1 (555) 911-0000" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                </div>
              </div>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Address Information</h3>
                <div><label class="block text-sm font-medium mb-1">Street Address</label><textarea formControlName="address" rows="2" placeholder="123 Main Street" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea></div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><label class="block text-sm font-medium mb-1">City</label><input type="text" formControlName="city" placeholder="City" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">State</label><input type="text" formControlName="state" placeholder="State" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Postal Code</label><input type="text" formControlName="postalCode" placeholder="12345" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                  <div><label class="block text-sm font-medium mb-1">Country</label><input type="text" formControlName="country" placeholder="Country" class="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Social Media Links</h3>
                  <button type="button" (click)="addSocialLink()" class="h-9 px-4 rounded-md border text-sm font-medium">Add Link</button>
                </div>
                <div class="space-y-2">
                  @for (link of socialLinks(); track $index) {
                    <div class="flex items-center gap-2">
                      <input type="url" [value]="link" (input)="updateSocialLink($index, $any($event.target).value)" placeholder="https://www.facebook.com/yourcompany" class="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      @if (socialLinks().length > 1) {
                        <button type="button" (click)="removeSocialLink($index)" class="text-red-500 hover:text-red-700 px-2">&times;</button>
                      }
                    </div>
                  }
                </div>
              </div>
              <div class="flex justify-between items-center pt-4 border-t">
                <span class="text-sm text-gray-500">{{ hasChanges() ? 'Unsaved changes' : '' }}</span>
                <button type="submit" [disabled]="!hasChanges() || isSaving()" class="h-10 bg-[#1a1a2e] text-white rounded-md px-6 font-medium disabled:opacity-50">
                  {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
            @if (currentContact()) {
              <div class="text-sm text-gray-500 border-t pt-4 mt-4">
                <div class="flex items-center justify-between">
                  <span>Last updated: {{ currentContact()!.lastUpdated | date:'medium' }}</span>
                  <span>Updated by: {{ currentContact()!.updatedBy }}</span>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class ContactPageConfigComponent implements OnInit {
  private api = inject(ApiService);
  private notification = inject(NotificationService);
  isLoading = signal(true);
  isSaving = signal(false);
  hasChanges = signal(false);
  currentContact = signal<any>(null);
  socialLinks = signal<string[]>(['']);

  contactForm = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    websiteUrl: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    supportEmail: new FormControl(''),
    salesEmail: new FormControl(''),
    alternatePhone: new FormControl(''),
    emergencyContact: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    postalCode: new FormControl(''),
    country: new FormControl(''),
  });

  ngOnInit() {
    this.api.getContactInfo().subscribe({
      next: (data: any) => {
        this.currentContact.set(data);
        this.contactForm.patchValue({
          companyName: data.companyName || '',
          websiteUrl: data.websiteUrl || '',
          email: data.email || '',
          phone: data.phone || '',
          supportEmail: data.supportEmail || '',
          salesEmail: data.salesEmail || '',
          alternatePhone: data.alternatePhone || '',
          emergencyContact: data.emergencyContact || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postalCode || '',
          country: data.country || '',
        });
        this.socialLinks.set(data.socialMediaLinks?.length > 0 ? data.socialMediaLinks : ['']);
        this.isLoading.set(false);
        this.hasChanges.set(false);
      },
      error: () => { this.isLoading.set(false); },
    });
    this.contactForm.valueChanges.subscribe(() => this.hasChanges.set(true));
  }

  addSocialLink() { this.socialLinks.update(links => [...links, '']); this.hasChanges.set(true); }
  removeSocialLink(index: number) { this.socialLinks.update(links => links.filter((_, i) => i !== index)); this.hasChanges.set(true); }
  updateSocialLink(index: number, value: string) { this.socialLinks.update(links => { const updated = [...links]; updated[index] = value; return updated; }); this.hasChanges.set(true); }

  onSubmit() {
    if (this.contactForm.invalid) return;
    this.isSaving.set(true);
    const data = {
      ...this.contactForm.value,
      socialMediaLinks: this.socialLinks().filter(l => l.trim()),
    };
    this.api.updateContactPage(data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.notification.success('Contact page updated successfully');
      },
      error: () => { this.isSaving.set(false); this.notification.error('Failed to update contact page'); },
    });
  }
}
