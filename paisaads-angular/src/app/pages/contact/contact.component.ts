import { Component, inject, signal, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly content = signal(`
    <h2>Contact Us</h2>
    <p>Have questions or need help? We are here for you. Reach out to us through any of the channels below.</p>
    <h3>Email</h3>
    <p>support@paisaads.com</p>
    <h3>Phone</h3>
    <p>+91 98765 43210</p>
    <h3>Address</h3>
    <p>PaisaAds Headquarters<br>Mumbai, Maharashtra<br>India - 400001</p>
    <h3>Business Hours</h3>
    <p>Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
  `);

  ngOnInit(): void {
    this.configService.getContactPage().subscribe({
      next: (res) => this.content.set(res.content),
      error: () => {},
    });
  }
}
