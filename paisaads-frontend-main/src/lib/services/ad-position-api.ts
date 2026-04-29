import api from '../api';
import { 

  AdPosition 
} from '../types/ad-position';

export class AdPositionAPI {
  
  static async assignAdPosition(data: any): Promise<AdPosition> {
    const response = await api.post<AdPosition>('/ad-position/assign', data);
    return response.data;
  }

  static async getAvailablePositions(params: {
    pageType: 'HOME' | 'CATEGORY';
    categoryId?: string;
    pageNumber?: number;
    adType?: 'VIDEO' | 'POSTER';
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append('pageType', params.pageType);
    
    if (params.categoryId) {
      searchParams.append('categoryId', params.categoryId);
    }
    
    if (params.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    
    if (params.adType) {
      searchParams.append('adType', params.adType);
    }

    const response = await api.get<any>(
      `/ad-position/available-positions?${searchParams.toString()}`
    );
    return response.data;
  }

  static async getPageLayout(params: {
    pageType: 'HOME' | 'CATEGORY';
    categoryId?: string;
    pageNumber?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append('pageType', params.pageType);
    
    if (params.categoryId) {
      searchParams.append('categoryId', params.categoryId);
    }
    
    if (params.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }

    const response = await api.get<any>(
      `/ad-position/layout?${searchParams.toString()}`
    );
    return response.data;
  }

  static async updateAdPosition(
    id: string, 
    data: {
      positionType?: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
      positionIndex?: number;
      pageType?: 'HOME' | 'CATEGORY';
      categoryId?: string;
      pageNumber?: number;
      targetDate?: string;
    }
  ): Promise<AdPosition> {
    const response = await api.patch<AdPosition>(`/ad-position/${id}`, data);
    return response.data;
  }

  static async removeAdPosition(id: string): Promise<void> {
    await api.delete(`/ad-position/${id}`);
  }

  static async getAdPosition(id: string): Promise<AdPosition> {
    const response = await api.get<AdPosition>(`/ad-position/${id}`);
    return response.data;
  }

  static async getAvailablePages(params: {
    categoryId: string;
    date?: string; 
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append('categoryId', params.categoryId);
    
    if (params.date) {
      searchParams.append('date', params.date);
    }

    try {
      const response = await api.get<any>(
        `/ad-position/available-pages?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {

      if (error?.response?.status === 404) {
        throw new Error('ENDPOINT_NOT_IMPLEMENTED');
      }
      throw error;
    }
  }

  static async getLineAdsCount(params: {
    categoryId: string;
    date?: string;
  }): Promise<{ totalPages: number; totalLineAds: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('categoryId', params.categoryId);
    searchParams.append('status', 'PUBLISHED'); 
    
    if (params.date) {
      searchParams.append('date', params.date);
    }

    try {
      const response = await api.get<{ total: number }>(
        `/line-ad/count?${searchParams.toString()}`
      );
      const totalLineAds = response.data.total;
      const totalPages = Math.ceil(totalLineAds / 12); 
      
      return { totalPages: Math.max(1, totalPages), totalLineAds };
    } catch (error: any) {

      if (error?.response?.status === 404) {
        throw new Error('LINE_ADS_ENDPOINT_NOT_AVAILABLE');
      }
      throw error;
    }
  }
}

export default AdPositionAPI;