import api from '@/lib/api';
import {
  AdSlotsOverviewResponse,
  LineAdsResponse,
  SlotDetailsResponse,
  PageTypeFilter,
  DateBasedAdSlotsOverview,
  DateBasedLineAds,
  DateBasedSlotDetails,
  AvailableDates
} from '@/lib/types/ad-slots';

export class AdSlotsApi {
  
  static async getAdSlotsOverview(pageType?: PageTypeFilter, category?: string): Promise<AdSlotsOverviewResponse> {
    const params = new URLSearchParams();
    if (pageType && pageType !== 'ALL') {
      params.append('pageType', pageType);
    }
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<AdSlotsOverviewResponse>(
      `/ad-position/ad-slots/overview${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  static async getLineAds(pageType?: PageTypeFilter, category?: string): Promise<LineAdsResponse> {
    const params = new URLSearchParams();
    if (pageType && pageType !== 'ALL') {
      params.append('pageType', pageType);
    }
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<LineAdsResponse>(
      `/ad-position/ad-slots/line-ads${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  static async getSlotDetails(
    pageType: 'HOME' | 'CATEGORY',
    side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM',
    position: number,
    category?: string
  ): Promise<SlotDetailsResponse> {
    const params = new URLSearchParams();
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<SlotDetailsResponse>(
      `/ad-position/ad-slots/slot-details/${pageType}/${side}/${position}${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  static async getAvailableDates(): Promise<AvailableDates> {
    const response = await api.get<AvailableDates>('/ad-position/ad-slots/available-dates');
    return response.data;
  }

  static async getAdSlotsByDate(date: string, pageType?: PageTypeFilter, category?: string): Promise<DateBasedAdSlotsOverview> {
    const params = new URLSearchParams();
    params.append('date', date);
    if (pageType && pageType !== 'ALL') {
      params.append('pageType', pageType);
    }
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<DateBasedAdSlotsOverview>(
      `/ad-position/ad-slots/by-date/overview?${params.toString()}`
    );
    return response.data;
  }

  static async getLineAdsByDate(date: string, pageType?: PageTypeFilter, category?: string): Promise<DateBasedLineAds> {
    const params = new URLSearchParams();
    params.append('date', date);
    if (pageType && pageType !== 'ALL') {
      params.append('pageType', pageType);
    }
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<DateBasedLineAds>(
      `/ad-position/ad-slots/by-date/line-ads?${params.toString()}`
    );
    return response.data;
  }

  static async getSlotDetailsByDate(
    date: string,
    pageType: 'HOME' | 'CATEGORY',
    side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM',
    position: number,
    category?: string
  ): Promise<DateBasedSlotDetails> {
    const params = new URLSearchParams();
    params.append('date', date);
    if (category) {
      params.append('category', category);
    }

    const response = await api.get<DateBasedSlotDetails>(
      `/ad-position/ad-slots/by-date/slot-details/${pageType}/${side}/${position}?${params.toString()}`
    );
    return response.data;
  }
}

export default AdSlotsApi;