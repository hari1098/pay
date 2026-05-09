import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-configurations',
  imports: [FormsModule, MatButton, MatFormField, MatLabel, MatInput],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css',
})
export class ConfigurationsComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly success = signal(false);

  searchSlogan = '';
  aboutUs = '';
  contactPage = '';
  privacyPolicy = '';
  termsAndConditions = '';

  ngOnInit(): void {
    this.configService.getSearchSlogan().subscribe({
      next: (res) => { this.searchSlogan = res.slogan; this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.configService.getAboutUs().subscribe({ next: (res) => this.aboutUs = res.content, error: () => {} });
    this.configService.getContactPage().subscribe({ next: (res) => this.contactPage = res.content, error: () => {} });
    this.configService.getPrivacyPolicy().subscribe({ next: (res) => this.privacyPolicy = res.content, error: () => {} });
    this.configService.getTermsAndConditions().subscribe({ next: (res) => this.termsAndConditions = res.content, error: () => {} });
  }

  onSave(): void {
    this.saving.set(true);
    this.success.set(false);
    // In a real app, this would call the config service to save changes
    setTimeout(() => {
      this.saving.set(false);
      this.success.set(true);
    }, 800);
  }
}
