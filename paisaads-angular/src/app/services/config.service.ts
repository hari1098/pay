import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ConfigService extends ApiService {

  getAboutUs() {
    return this.get<{ content: string }>('/config/about-us');
  }

  getContactPage() {
    return this.get<{ content: string }>('/config/contact');
  }

  getFaq() {
    return this.get<{ items: { question: string; answer: string }[] }>('/config/faq');
  }

  getPrivacyPolicy() {
    return this.get<{ content: string }>('/config/privacy-policy');
  }

  getTermsAndConditions() {
    return this.get<{ content: string }>('/config/terms-and-conditions');
  }

  getSearchSlogan() {
    return this.get<{ slogan: string }>('/config/search-slogan');
  }

  getAdPricing() {
    return this.get<{ line: number; poster: number; video: number }>('/config/ad-pricing');
  }
}
