import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LineAd, PosterAd, VideoAd, Category, AuthResponse,
  LoginRequest, RegisterRequest, User, DashboardStats,
  ContactInfo, FaqItem, SearchSlogan
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Auth
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/profile`);
  }

  // Line Ads
  getLineAdsToday(): Observable<LineAd[]> {
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/today`);
  }

  getMyLineAds(): Observable<LineAd[]> {
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/my-ads`);
  }

  getLineAdsByStatus(status: string): Observable<LineAd[]> {
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/status/${status}`);
  }

  createLineAd(data: any): Observable<LineAd> {
    return this.http.post<LineAd>(`${this.baseUrl}/line-ad`, data);
  }

  // Poster Ads
  getPosterAdsToday(): Observable<PosterAd[]> {
    return this.http.get<PosterAd[]>(`${this.baseUrl}/poster-ad/today`);
  }

  getMyPosterAds(): Observable<PosterAd[]> {
    return this.http.get<PosterAd[]>(`${this.baseUrl}/poster-ad/my-ads`);
  }

  createPosterAd(data: any): Observable<PosterAd> {
    return this.http.post<PosterAd>(`${this.baseUrl}/poster-ad`, data);
  }

  // Video Ads
  getVideoAdsToday(): Observable<VideoAd[]> {
    return this.http.get<VideoAd[]>(`${this.baseUrl}/video-ad/today`);
  }

  getMyVideoAds(): Observable<VideoAd[]> {
    return this.http.get<VideoAd[]>(`${this.baseUrl}/video-ad/my-ads`);
  }

  createVideoAd(data: any): Observable<VideoAd> {
    return this.http.post<VideoAd>(`${this.baseUrl}/video-ad`, data);
  }

  // Categories
  getCategoryTree(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/tree`);
  }

  // Dashboard
  getUserDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/ad-dashboard/user`);
  }

  getGlobalDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/ad-dashboard/global`);
  }

  // Configurations
  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(`${this.baseUrl}/configurations/contact-page`);
  }

  getFaq(): Observable<{ questions: FaqItem[] }> {
    return this.http.get<{ questions: FaqItem[] }>(`${this.baseUrl}/configurations/faq`);
  }

  getAboutUs(): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.baseUrl}/configurations/about-us`);
  }

  getPrivacyPolicy(): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.baseUrl}/configurations/privacy-policy`);
  }

  getTermsAndConditions(): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.baseUrl}/configurations/terms-and-conditions`);
  }

  getSearchSlogan(): Observable<SearchSlogan> {
    return this.http.get<SearchSlogan>(`${this.baseUrl}/configurations/search-slogan`);
  }

  // Ad actions (admin)
  approveLineAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/approve`, {});
  }

  rejectLineAd(id: string, reason: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/reject`, { reason });
  }

  approvePosterAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/poster-ad/${id}/approve`, {});
  }

  approveVideoAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/video-ad/${id}/approve`, {});
  }
}
