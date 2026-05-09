import { Component, inject, signal, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css',
})
export class PrivacyComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly content = signal(`
    <h2>Privacy Policy</h2>
    <p>Last updated: January 2025</p>
    <h3>Information We Collect</h3>
    <p>We collect information you provide when registering, posting ads, or contacting us. This includes your name, email, phone number, and ad content.</p>
    <h3>How We Use Your Information</h3>
    <p>Your information is used to provide and improve our services, process your ads, communicate with you, and ensure platform safety.</p>
    <h3>Data Protection</h3>
    <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
    <h3>Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal data. Contact our support team for assistance with data requests.</p>
  `);

  ngOnInit(): void {
    this.configService.getPrivacyPolicy().subscribe({
      next: (res) => this.content.set(res.content),
      error: () => {},
    });
  }
}
