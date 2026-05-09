export type AdStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AdType = 'LINE' | 'POSTER' | 'VIDEO';

export interface LineAd {
  id: string;
  content: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  postedBy: string;
  postedByName?: string;
  contactOne: string;
  contactTwo?: string;
  status: AdStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface PosterAd {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  postedBy: string;
  postedByName?: string;
  contactOne: string;
  contactTwo?: string;
  status: AdStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface VideoAd {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  postedBy: string;
  postedByName?: string;
  contactOne: string;
  contactTwo?: string;
  status: AdStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface CreateLineAdRequest {
  content: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  contactOne: string;
  contactTwo?: string;
}

export interface CreatePosterAdRequest {
  title: string;
  content: string;
  imageUrl: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  contactOne: string;
  contactTwo?: string;
}

export interface CreateVideoAdRequest {
  title: string;
  content: string;
  videoUrl: string;
  mainCategory: string;
  categoryOne: string;
  categoryTwo?: string;
  state: string;
  city: string;
  contactOne: string;
  contactTwo?: string;
}

export interface AdSearchRequest {
  mainCategory?: string;
  categoryOne?: string;
  state?: string;
  city?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
