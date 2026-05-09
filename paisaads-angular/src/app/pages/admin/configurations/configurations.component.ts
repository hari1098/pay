import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-configurations',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Configurations</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (config of configItems; track config.title) {
          <a [routerLink]="config.href" class="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 class="text-lg font-semibold">{{ config.title }}</h3>
            <p class="text-sm text-gray-500 mt-2">{{ config.description }}</p>
          </a>
        }
      </div>
    </div>
  `,
})
export class ConfigurationsComponent {
  configItems = [
    { title: 'Ad Pricing', href: '/mgmt/dashboard/configurations/ad-pricing', description: 'Configure ad pricing settings' },
    { title: 'Privacy Policy', href: '/mgmt/dashboard/configurations/privacy-policy', description: 'Edit privacy policy content' },
    { title: 'Search Slogan', href: '/mgmt/dashboard/configurations/search-slogan', description: 'Update search page slogans' },
    { title: 'FAQ', href: '/mgmt/dashboard/configurations/faq', description: 'Manage FAQ content' },
    { title: 'Contact Page', href: '/mgmt/dashboard/configurations/contact-page', description: 'Edit contact page information' },
    { title: 'Terms and Conditions', href: '/mgmt/dashboard/configurations/tc', description: 'Edit terms and conditions' },
  ];
}
