import { Component, inject, signal, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfigService } from '../../services/config.service';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [MatExpansionModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FaqComponent implements OnInit {
  private readonly configService = inject(ConfigService);

  readonly faqItems = signal<FaqItem[]>([
    { question: 'How do I post an ad on PaisaAds?', answer: 'Create a free account, go to your Dashboard, click "Post Ad", choose your ad type (Line, Poster, or Video), fill in the details, and submit. Your ad will be reviewed and published within 24 hours.' },
    { question: 'Is it free to post ads?', answer: 'Line ads are free to post. Poster and Video ads have nominal charges. Check our pricing page for details.' },
    { question: 'How long do ads stay published?', answer: 'Ads typically stay published for 30 days. You can renew or repost your ad from your dashboard.' },
    { question: 'How do I edit or delete my ad?', answer: 'Go to your Dashboard > My Ads, find the ad you want to modify, and use the edit or delete options.' },
    { question: 'My ad was rejected. What should I do?', answer: 'Ads are rejected if they violate our content policy. Review the rejection reason, make necessary changes, and resubmit. Contact support if you need help.' },
    { question: 'How do I contact an ad poster?', answer: 'Each ad displays the poster\'s contact information. Use the phone number or other contact details provided in the ad.' },
  ]);

  ngOnInit(): void {
    this.configService.getFaq().subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.faqItems.set(res.items);
        }
      },
      error: () => {},
    });
  }
}
