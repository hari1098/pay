import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ContactInfo } from '../../shared/models/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="pt-20 px-4 pb-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">Get in touch with {{ contactData()?.companyName || 'us' }}. We're here to help!</p>
        </div>
        @if (isLoading()) {
          <div class="animate-pulse space-y-4"><div class="h-8 bg-gray-200 rounded w-1/3"></div><div class="h-4 bg-gray-200 rounded w-full"></div></div>
        } @else if (contactData()) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="bg-white rounded-lg border shadow-sm p-6">
              <h2 class="text-lg font-semibold mb-6">Primary Contact</h2>
              <div class="space-y-6">
                @if (contactData()!.email) {
                  <div class="flex items-start gap-4">
                    <svg class="h-5 w-5 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <div><p class="font-medium">Email Address</p><a [href]="'mailto:' + contactData()!.email" class="text-blue-600 hover:text-blue-800">{{ contactData()!.email }}</a></div>
                  </div>
                }
                @if (contactData()!.phone) {
                  <div class="flex items-start gap-4">
                    <svg class="h-5 w-5 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <div><p class="font-medium">Phone Number</p><a [href]="'tel:' + contactData()!.phone" class="text-gray-700 hover:text-gray-900">{{ contactData()!.phone }}</a></div>
                  </div>
                }
              </div>
            </div>
            <div class="bg-white rounded-lg border shadow-sm p-6">
              <h2 class="text-lg font-semibold mb-6">Address</h2>
              <div class="flex items-start gap-4">
                <svg class="h-5 w-5 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <div>
                  <p class="font-medium mb-2">Office Location</p>
                  <div class="text-gray-700 space-y-1">
                    <p>{{ contactData()!.address }}</p>
                    <p>{{ formatAddress() }}</p>
                    <p>{{ contactData()!.country }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          @if (contactData()!.businessHours) {
            <div class="bg-white rounded-lg border shadow-sm p-6 mb-12">
              <h2 class="text-lg font-semibold flex items-center gap-2 mb-4">
                <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Business Hours
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                @for (item of businessHours; track item.day) {
                  <div class="text-center p-3 border rounded-lg">
                    <p class="font-medium capitalize">{{ item.day }}</p>
                    <p class="text-sm text-gray-600">{{ item.hours }}</p>
                  </div>
                }
              </div>
            </div>
          }
        } @else {
          <div class="text-center"><p class="text-gray-600">Contact information not available at the moment.</p></div>
        }
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  private api = inject(ApiService);
  contactData = signal<ContactInfo | null>(null);
  isLoading = signal(true);

  get businessHours() {
    const data = this.contactData();
    if (!data?.businessHours) return [];
    return Object.entries(data.businessHours).map(([day, hours]) => ({ day, hours }));
  }

  formatAddress(): string {
    const data = this.contactData();
    if (!data) return '';
    return [data.city, data.state, data.postalCode].filter(x => !!x).join(', ');
  }

  ngOnInit() {
    this.api.getContactInfo().subscribe({
      next: (data) => { this.contactData.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}
