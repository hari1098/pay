import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LineAd, PosterAd, VideoAd, CreateLineAdRequest, CreatePosterAdRequest, CreateVideoAdRequest, AdSearchRequest, PaginatedResponse } from '../models/ad.model';

@Injectable({ providedIn: 'root' })
export class AdService extends ApiService {

  getLineAdsToday(params?: AdSearchRequest) {
    return this.get<PaginatedResponse<LineAd>>('/ads/line/today', params as Record<string, string | number>);
  }

  getPosterAdsToday() {
    return this.get<PosterAd[]>('/ads/poster/today');
  }

  getVideoAdsToday() {
    return this.get<VideoAd[]>('/ads/video/today');
  }

  searchLineAds(params: AdSearchRequest) {
    return this.get<PaginatedResponse<LineAd>>('/ads/line/search', params as Record<string, string | number>);
  }

  getMyLineAds() {
    return this.get<LineAd[]>('/ads/line/my');
  }

  getMyPosterAds() {
    return this.get<PosterAd[]>('/ads/poster/my');
  }

  getMyVideoAds() {
    return this.get<VideoAd[]>('/ads/video/my');
  }

  getAdsByStatus(type: 'line' | 'poster' | 'video', status: string, page = 0, size = 20) {
    return this.get<PaginatedResponse<LineAd | PosterAd | VideoAd>>(`/admin/ads/${type}/status/${status}`, { page, size });
  }

  createLineAd(data: CreateLineAdRequest) {
    return this.post<LineAd>('/ads/line', data);
  }

  createPosterAd(data: CreatePosterAdRequest) {
    return this.post<PosterAd>('/ads/poster', data);
  }

  createVideoAd(data: CreateVideoAdRequest) {
    return this.post<VideoAd>('/ads/video', data);
  }

  approveAd(type: 'line' | 'poster' | 'video', id: string) {
    return this.patch<void>(`/admin/ads/${type}/${id}/approve`, {});
  }

  rejectAd(type: 'line' | 'poster' | 'video', id: string) {
    return this.patch<void>(`/admin/ads/${type}/${id}/reject`, {});
  }
}
