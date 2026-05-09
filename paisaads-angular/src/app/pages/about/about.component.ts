import { Component, inject, signal, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly content = signal(`
    <h2>About PaisaAds</h2>
    <p>PaisaAds is India's leading classified ads platform, connecting buyers and sellers across the nation. Our mission is to make buying and selling simple, fast, and accessible for everyone.</p>
    <h3>Our Mission</h3>
    <p>We believe that everyone should have access to a marketplace where they can find what they need or sell what they no longer use. PaisaAds provides a user-friendly platform that makes classified advertising easy and effective.</p>
    <h3>What We Offer</h3>
    <ul>
      <li><strong>Line Ads</strong> - Quick text-based ads for services, jobs, and more</li>
      <li><strong>Poster Ads</strong> - Visually rich ads with images for products and properties</li>
      <li><strong>Video Ads</strong> - Engaging video content for maximum impact</li>
    </ul>
    <h3>Why Choose PaisaAds?</h3>
    <p>With a wide reach across India, easy-to-use interface, and affordable pricing, PaisaAds is the go-to platform for classified advertising. Our commitment to quality and user satisfaction sets us apart.</p>
  `);

  ngOnInit(): void {
    this.configService.getAboutUs().subscribe({
      next: (res) => this.content.set(res.content),
      error: () => {},
    });
  }
}
