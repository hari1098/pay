import { Component, inject, signal, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-terms',
  imports: [],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class TermsComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly content = signal(`
    <h2>Terms and Conditions</h2>
    <p>Last updated: January 2025</p>
    <h3>Acceptance of Terms</h3>
    <p>By using PaisaAds, you agree to these terms and conditions. If you do not agree, please do not use our platform.</p>
    <h3>User Accounts</h3>
    <p>You must register with accurate information. You are responsible for maintaining the security of your account and all activities under it.</p>
    <h3>Ad Content</h3>
    <p>All ads must comply with our content guidelines. We reserve the right to reject, modify, or remove any ad that violates our policies.</p>
    <h3>Prohibited Content</h3>
    <p>Ads containing illegal products, offensive content, misleading claims, or spam will be removed and may result in account suspension.</p>
    <h3>Liability</h3>
    <p>PaisaAds is not liable for transactions between users. We provide the platform but do not guarantee the accuracy of ad content.</p>
  `);

  ngOnInit(): void {
    this.configService.getTermsAndConditions().subscribe({
      next: (res) => this.content.set(res.content),
      error: () => {},
    });
  }
}
