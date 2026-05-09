import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { ContactInfo } from '../../shared/models/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 text-white py-12 mt-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center">
              <img src="/logo.png" alt="PaisaAds" class="h-10 w-auto" />
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              Your trusted platform for classified advertisements. Connect buyers and sellers across various categories with ease and reliability.
            </p>
            <div class="flex space-x-4">
              @if (contactInfo()?.socialMediaLinks?.length) {
                @for (link of contactInfo()!.socialMediaLinks.slice(0, 3); track $index) {
                  <a [href]="link" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                    <span class="sr-only">Social Media</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.49-2.068 4.663-1.173 1.172-2.805 1.899-4.663 2.068-1.858-.169-3.49-.896-4.663-2.068C4.001 11.65 3.274 10.018 3.105 8.16c.169-1.858.896-3.49 2.068-4.663C6.346 2.324 7.978 1.597 9.836 1.428c1.858.169 3.49.896 4.663 2.069 1.172 1.173 1.899 2.805 2.069 4.663z"/></svg>
                  </a>
                }
              }
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Quick Links</h3>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a routerLink="/search" class="text-gray-400 hover:text-white transition-colors text-sm">Browse Ads</a></li>
              <li><a routerLink="/dashboard/post-ad/line-ad" class="text-gray-400 hover:text-white transition-colors text-sm">Post Ad</a></li>
              <li><a routerLink="/dashboard" class="text-gray-400 hover:text-white transition-colors text-sm">My Dashboard</a></li>
              <li><a routerLink="/about-us" class="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Support</h3>
            <ul class="space-y-2">
              <li><a routerLink="/help" class="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a routerLink="/faq" class="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a routerLink="/privacy-policy" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a routerLink="/terms-and-conditions" class="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Contact Info</h3>
            @if (contactInfo()) {
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <p class="text-gray-400 text-sm">{{ contactInfo()!.address }}{{ contactInfo()!.city ? ', ' + contactInfo()!.city : '' }}{{ contactInfo()!.state ? ', ' + contactInfo()!.state : '' }} {{ contactInfo()!.postalCode }}{{ contactInfo()!.country ? ', ' + contactInfo()!.country : ', Nepal' }}</p>
                </div>
                <div class="flex items-start space-x-3">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <p class="text-gray-400 text-sm">{{ contactInfo()!.email }}</p>
                </div>
                <div class="flex items-start space-x-3">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <p class="text-gray-400 text-sm">{{ contactInfo()!.phone }}</p>
                </div>
              </div>
            } @else {
              <div class="space-y-3">
                <div class="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div class="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div class="h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            }
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-sm text-gray-400">&copy; {{ currentYear }} {{ contactInfo()?.companyName || 'PaisaAds' }}. All rights reserved.</p>
            <p class="text-xs text-gray-500">Developed and maintained by <a href="https://mobifish.in" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">MobiFish</a></p>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private api = inject(ApiService);
  contactInfo = signal<ContactInfo | null>(null);
  currentYear = new Date().getFullYear();

  constructor() {
    this.api.getContactInfo().subscribe({
      next: (data) => this.contactInfo.set(data),
      error: () => this.contactInfo.set(null),
    });
  }
}
