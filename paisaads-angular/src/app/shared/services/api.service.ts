import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LineAd, PosterAd, VideoAd, CategoryTree, User, Customer,
  DashboardStats, ContactInfo, FaqData, SearchSlogan,
  PrivacyPolicyData, TermsData, FlatCategory
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(data: { emailOrPhone: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data, { withCredentials: true });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register-customer`, data, { withCredentials: true });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/profile`, { withCredentials: true });
  }

  checkAuth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/current`, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true });
  }

  sendVerificationOtp(phone: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/send-verification-otp`, { phone }, { withCredentials: true });
  }

  verifyAccount(phone: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verify-account`, { phone, otp }, { withCredentials: true });
  }

  sendLoginOtp(phone: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/send-login-otp`, { phone }, { withCredentials: true });
  }

  verifyLoginOtp(phone: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/verify-login-otp`, { phone, otp }, { withCredentials: true });
  }

  // Line Ads
  getLineAdsToday(params?: { categoryId?: string; stateId?: string; cityId?: string }): Observable<LineAd[]> {
    let httpParams = new HttpParams();
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.stateId) httpParams = httpParams.set('stateId', params.stateId);
    if (params?.cityId) httpParams = httpParams.set('cityId', params.cityId);
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/today`, { params: httpParams, withCredentials: true });
  }

  getMyLineAds(): Observable<LineAd[]> {
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/my-ads`, { withCredentials: true });
  }

  getLineAdById(id: string): Observable<LineAd> {
    return this.http.get<LineAd>(`${this.baseUrl}/line-ad/${id}`, { withCredentials: true });
  }

  createLineAd(data: any): Observable<LineAd> {
    return this.http.post<LineAd>(`${this.baseUrl}/line-ad`, data, { withCredentials: true });
  }

  updateLineAd(id: string, data: any): Observable<LineAd> {
    return this.http.put<LineAd>(`${this.baseUrl}/line-ad/${id}`, data, { withCredentials: true });
  }

  getLineAdsByStatus(status: string): Observable<LineAd[]> {
    return this.http.get<LineAd[]>(`${this.baseUrl}/line-ad/status/${status}`, { withCredentials: true });
  }

  approveLineAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/approve`, { comment }, { withCredentials: true });
  }

  rejectLineAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/reject`, { comment }, { withCredentials: true });
  }

  holdLineAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/hold`, { comment }, { withCredentials: true });
  }

  publishLineAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/publish`, {}, { withCredentials: true });
  }

  pauseLineAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/line-ad/${id}/pause`, {}, { withCredentials: true });
  }

  // Poster Ads
  getPosterAdsToday(params?: { categoryId?: string; stateId?: string; cityId?: string }): Observable<PosterAd[]> {
    let httpParams = new HttpParams();
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.stateId) httpParams = httpParams.set('stateId', params.stateId);
    if (params?.cityId) httpParams = httpParams.set('cityId', params.cityId);
    return this.http.get<PosterAd[]>(`${this.baseUrl}/poster-ad/today`, { params: httpParams, withCredentials: true });
  }

  getMyPosterAds(): Observable<PosterAd[]> {
    return this.http.get<PosterAd[]>(`${this.baseUrl}/poster-ad/my-ads`, { withCredentials: true });
  }

  getPosterAdById(id: string): Observable<PosterAd> {
    return this.http.get<PosterAd>(`${this.baseUrl}/poster-ad/${id}`, { withCredentials: true });
  }

  createPosterAd(data: any): Observable<PosterAd> {
    return this.http.post<PosterAd>(`${this.baseUrl}/poster-ad`, data, { withCredentials: true });
  }

  updatePosterAd(id: string, data: any): Observable<PosterAd> {
    return this.http.put<PosterAd>(`${this.baseUrl}/poster-ad/${id}`, data, { withCredentials: true });
  }

  getPosterAdsByStatus(status: string): Observable<PosterAd[]> {
    return this.http.get<PosterAd[]>(`${this.baseUrl}/poster-ad/status/${status}`, { withCredentials: true });
  }

  approvePosterAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/poster-ad/${id}/approve`, { comment }, { withCredentials: true });
  }

  rejectPosterAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/poster-ad/${id}/reject`, { comment }, { withCredentials: true });
  }

  holdPosterAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/poster-ad/${id}/hold`, { comment }, { withCredentials: true });
  }

  publishPosterAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/poster-ad/${id}/publish`, {}, { withCredentials: true });
  }

  // Video Ads
  getVideoAdsToday(params?: { categoryId?: string; stateId?: string; cityId?: string }): Observable<VideoAd[]> {
    let httpParams = new HttpParams();
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.stateId) httpParams = httpParams.set('stateId', params.stateId);
    if (params?.cityId) httpParams = httpParams.set('cityId', params.cityId);
    return this.http.get<VideoAd[]>(`${this.baseUrl}/video-ad/today`, { params: httpParams, withCredentials: true });
  }

  getMyVideoAds(): Observable<VideoAd[]> {
    return this.http.get<VideoAd[]>(`${this.baseUrl}/video-ad/my-ads`, { withCredentials: true });
  }

  getVideoAdById(id: string): Observable<VideoAd> {
    return this.http.get<VideoAd>(`${this.baseUrl}/video-ad/${id}`, { withCredentials: true });
  }

  createVideoAd(data: any): Observable<VideoAd> {
    return this.http.post<VideoAd>(`${this.baseUrl}/video-ad`, data, { withCredentials: true });
  }

  updateVideoAd(id: string, data: any): Observable<VideoAd> {
    return this.http.put<VideoAd>(`${this.baseUrl}/video-ad/${id}`, data, { withCredentials: true });
  }

  getVideoAdsByStatus(status: string): Observable<VideoAd[]> {
    return this.http.get<VideoAd[]>(`${this.baseUrl}/video-ad/status/${status}`, { withCredentials: true });
  }

  approveVideoAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/video-ad/${id}/approve`, { comment }, { withCredentials: true });
  }

  rejectVideoAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/video-ad/${id}/reject`, { comment }, { withCredentials: true });
  }

  holdVideoAd(id: string, comment: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/video-ad/${id}/hold`, { comment }, { withCredentials: true });
  }

  publishVideoAd(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/video-ad/${id}/publish`, {}, { withCredentials: true });
  }

  // Categories
  getCategoryTree(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.baseUrl}/categories/tree`, { withCredentials: true });
  }

  // Dashboard
  getUserDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/ad-dashboard/user`, { withCredentials: true });
  }

  getGlobalDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/ad-dashboard/global`, { withCredentials: true });
  }

  // Customer
  getCustomerProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/users/customer/me`, { withCredentials: true });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/profile`, data, { withCredentials: true });
  }

  changePassword(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/change-password`, data, { withCredentials: true });
  }

  // Configurations
  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(`${this.baseUrl}/configurations/contact-page`, { withCredentials: true });
  }

  getFaq(): Observable<FaqData> {
    return this.http.get<FaqData>(`${this.baseUrl}/configurations/faq`, { withCredentials: true });
  }

  getPrivacyPolicy(): Observable<PrivacyPolicyData> {
    return this.http.get<PrivacyPolicyData>(`${this.baseUrl}/configurations/privacy-policy`, { withCredentials: true });
  }

  getTermsAndConditions(): Observable<TermsData> {
    return this.http.get<TermsData>(`${this.baseUrl}/configurations/terms-and-conditions`, { withCredentials: true });
  }

  getSearchSlogan(): Observable<SearchSlogan> {
    return this.http.get<SearchSlogan>(`${this.baseUrl}/configurations/search-slogan`, { withCredentials: true });
  }

  // Images
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/images/upload`, formData, {
      withCredentials: true,
    });
  }

  getImageUrl(fileName: string): string {
    return `${this.baseUrl}/images?imageName=${fileName}`;
  }

  // Admin - Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`, { withCredentials: true });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`, { withCredentials: true });
  }

  activateUser(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${id}/activate`, {}, { withCredentials: true });
  }

  deactivateUser(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${id}/deactivate`, {}, { withCredentials: true });
  }

  // Admin - Categories Management
  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data, { withCredentials: true });
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data, { withCredentials: true });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`, { withCredentials: true });
  }

  // Admin - Configurations
  getAdPricing(): Observable<any> {
    return this.http.get(`${this.baseUrl}/configurations/ad-pricing`, { withCredentials: true });
  }

  getAdPricingHistory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/configurations/ad-pricing/history`, { withCredentials: true });
  }

  updateAdPricing(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/configurations/ad-pricing`, data, { withCredentials: true });
  }

  updateContactPage(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/configurations/contact-page`, data, { withCredentials: true });
  }

  updateFaq(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/configurations/faq`, data, { withCredentials: true });
  }

  updatePrivacyPolicy(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/configurations/privacy-policy`, data, { withCredentials: true });
  }

  updateSearchSlogan(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/configurations/search-slogan`, data, { withCredentials: true });
  }

  updateTermsAndConditions(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/configurations/terms-and-conditions`, data, { withCredentials: true });
  }

  // Helper to flatten category tree
  flattenCategories(categories: CategoryTree[] | undefined): FlatCategory[] {
    if (!categories) return [];
    let result: FlatCategory[] = [];
    categories.forEach((category) => {
      result.push({ id: category.id, name: category.name });
      if (category.children && category.children.length > 0) {
        result = [...result, ...this.flattenCategories(category.children)];
      }
    });
    return result;
  }
}
