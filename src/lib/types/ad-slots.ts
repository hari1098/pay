
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface SlotOccupancy {
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number;
  activeAdsCount: number;
  maxCapacity: number;
  isOccupied: boolean;
  earliestExpiryDate?: string;
  latestExpiryDate?: string;
  categoryId?: string;
  categoryName?: string;
}

export interface AdSlotsOverviewResponse {
  totalSlots: number;
  occupiedSlots: number;
  freeSlots: number;
  slots: SlotOccupancy[];
}

export interface LineAdSummary {
  id: string;
  title: string;
  content: string;
  pageType: 'HOME' | 'CATEGORY';
  status: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  categoryName?: string;
}

export interface LineAdsResponse {
  homeAds: LineAdSummary[];
  categoryAds: LineAdSummary[];
  totalCount: number;
}

export interface SlotAdDetail {
  id: string;
  title: string;
  content?: string;
  status: string;
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  adType: string;
  categoryId?: string;
  categoryName?: string;
}

export interface SlotDetailsResponse {
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number;
  maxCapacity: number;
  currentOccupancy: number;
  ads: SlotAdDetail[];
}

export interface AdSlot {
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number;
  occupancy: number;
  maxCapacity: number;
  status: 'FREE' | 'PARTIALLY_OCCUPIED' | 'FULL';
  ads: SlotAd[];
}

export interface SlotAd {
  orderId: string;
  adType: 'POSTER' | 'VIDEO';
  status: 'PUBLISHED' | 'SCHEDULED' | 'EXPIRED';
  expiryDate: string;
  sequenceNumber: number;
  created_at: string;
}

export interface LineAdItem {
  orderId: string;
  adType: 'LINE';
  status: 'PUBLISHED' | 'SCHEDULED' | 'EXPIRED';
  expiryDate: string;
  sequenceNumber: number;
  created_at: string;
  content: string;
  pageType: 'HOME' | 'CATEGORY';
}

export type SlotFilter = 'ALL' | 'FREE' | 'PARTIALLY_OCCUPIED' | 'FULL';
export type PageTypeFilter = 'ALL' | 'HOME' | 'CATEGORY';

export interface DateBasedSlotOccupancy {
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number;
  activeAdsCount: number;
  maxCapacity: number;
  isOccupied: boolean;
  categories: Category[];
}

export interface DateBasedAdSlotsOverview {
  date: string;
  totalSlots: number;
  occupiedSlots: number;
  freeSlots: number;
  slots: DateBasedSlotOccupancy[];
  categories: Category[];
}

export interface DateBasedLineAd {
  id: string;
  title: string;
  content: string;
  pageType: 'HOME' | 'CATEGORY';
  status: string;
  createdAt: string;
  updatedAt: string;
  mainCategory?: Category;
  categoryOne?: { id: string; name: string };
  categoryTwo?: { id: string; name: string };
  categoryThree?: { id: string; name: string };
}

export interface DateBasedLineAds {
  date: string;
  homeAds: DateBasedLineAd[];
  categoryAds: DateBasedLineAd[];
  totalCount: number;
  categories: Category[];
}

export interface AvailableDates {
  dates: string[];
  totalDates: number;
}

export interface DateBasedSlotAdDetail {
  id: string;
  title: string;
  content?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  adType: string;
  mainCategory?: Category;
  categoryOne?: { id: string; name: string };
  categoryTwo?: { id: string; name: string };
  categoryThree?: { id: string; name: string };
}

export interface DateBasedSlotDetails {
  date: string;
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number;
  maxCapacity: number;
  currentOccupancy: number;
  ads: DateBasedSlotAdDetail[];
  categories: Category[];
}
