// Enums
export enum AdStatus {
  DRAFT = 'DRAFT',
  FOR_REVIEW = 'FOR_REVIEW',
  REJECTED = 'REJECTED',
  HOLD = 'HOLD',
  YET_TO_BE_PUBLISHED = 'YET_TO_BE_PUBLISHED',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
}

export enum AdType {
  LINE = 'LINE',
  POSTER = 'POSTER',
  VIDEO = 'VIDEO',
}

export enum PageType {
  HOME = 'HOME',
  CATEGORY = 'CATEGORY',
}

export enum PositionType {
  LEFT_SIDE = 'LEFT_SIDE',
  RIGHT_SIDE = 'RIGHT_SIDE',
  CENTER_TOP = 'CENTER_TOP',
  CENTER_BOTTOM = 'CENTER_BOTTOM',
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EDITOR = 'EDITOR',
  REVIEWER = 'REVIEWER',
  VIEWER = 'VIEWER',
  USER = 'USER',
}

export enum UserType {
  CUSTOMER = 'customer',
  RESELLER = 'reseller',
}

export enum PostedBy {
  OWNER = 'Owner',
  AGENCY = 'Agency',
  DEALER = 'Dealer',
  PROMOTERDEVELOPER = 'Promoter/Developer',
  OTHERS = 'OTHERS',
}

// Models
export interface Media {
  id: string;
  created_at: string;
  updated_at: string;
  fileName: string;
  filePath: string;
  isTemp: boolean;
  uploaded_on: string;
}

export interface MainCategory {
  id: string;
  name: string;
  category_heading_font_color: string;
  categories_color: string;
  font_color: string;
  isActive: boolean;
  subCategories: SubCategory[];
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  category_heading_font_color: string;
  isActive: boolean;
  categories_color?: string;
  font_color?: string;
  subCategories?: SubCategory[];
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  method: string;
  amount: string;
  details: string;
  proof: Media;
}

export interface Admin {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  secondary_number?: string;
  role: Role;
  isActive: boolean;
  is_active?: boolean;
  phone_verified: boolean;
  admin: Admin | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  country: string;
  country_id: string;
  state: string;
  state_id: string;
  city: string;
  city_id: string;
  proof: Media;
  gender: number;
  user: User;
}

export interface AdPosition {
  id: string;
  adType: AdType;
  pageType: PageType;
  side?: PositionType;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface LineAd {
  id: string;
  created_at: string;
  updated_at: string;
  sequenceNumber?: number;
  orderId: string | null;
  mainCategory: MainCategory;
  mainCategoryId?: string;
  categoryOne: SubCategory;
  categoryTwo: SubCategory;
  categoryThree: SubCategory;
  content: string;
  images: Media[];
  state: string;
  sid: number;
  city: string;
  cid: number;
  dates: string[];
  payment: Payment;
  status: string;
  comments: any[];
  customer: Customer;
  isActive: boolean;
  postedBy: string;
  contactOne: number;
  contactTwo?: number;
  pageType: PageType;
  textColor: string;
  backgroundColor: string;
}

export interface PosterAd {
  id: string;
  sequenceNumber: number;
  orderId?: number;
  mainCategory: MainCategory;
  mainCategoryId?: string;
  categoryOne?: SubCategory;
  categoryTwo?: SubCategory;
  categoryThree?: SubCategory;
  image: Media;
  images?: Media[];
  link?: string;
  title?: string;
  contactOne?: string;
  contactTwo?: string;
  payment?: Payment | null;
  status: string;
  comments?: any[];
  isActive: boolean;
  dates: string[];
  customer: Customer;
  postedBy: string;
  state: string;
  sid: number;
  city: string;
  cid: number;
  created_at: string;
  updated_at: string;
  position: AdPosition;
}

export interface VideoAd {
  id: string;
  sequenceNumber: number;
  orderId?: number;
  mainCategory: MainCategory;
  mainCategoryId?: string;
  categoryOne?: SubCategory;
  categoryTwo?: SubCategory;
  categoryThree?: SubCategory;
  image: Media;
  title?: string;
  contactOne?: string;
  contactTwo?: string;
  videoUrl?: string;
  payment?: Payment | null;
  status: string;
  comments?: any[];
  isActive: boolean;
  dates: string[];
  customer: Customer;
  postedBy: string;
  state: string;
  sid: number;
  city: string;
  cid: number;
  created_at: string;
  updated_at: string;
  position: AdPosition;
}

export interface DashboardStats {
  totalAds: number;
  statusCounts: {
    DRAFT: number;
    FOR_REVIEW: number;
    REJECTED: number;
    HOLD: number;
    YET_TO_BE_PUBLISHED: number;
    PUBLISHED: number;
    PAUSED: number;
  };
  ads: any[];
  videoAds: number;
  posterAds: number;
  lineAds: number;
}

export interface ContactInfo {
  companyName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMediaLinks: string[];
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  supportEmail?: string;
  salesEmail?: string;
  emergencyContact?: string;
  websiteUrl?: string;
}

export interface FaqData {
  introduction?: string;
  categories?: string[];
  questions: FaqQuestion[];
  contactInfo?: {
    email: string;
    phone: string;
  };
}

export interface FaqQuestion {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order?: number;
}

export interface SearchSlogan {
  primarySlogan: string;
  secondarySlogan: string;
}

export interface PrivacyPolicyData {
  content: string;
  version?: string;
  effectiveDate?: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface TermsData {
  content: string;
  version?: string;
  effectiveDate?: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  children?: CategoryTree[];
}

// Utility types
export type AdStatusPage = 'review-ads' | 'published-ads' | 'ads-on-hold' | 'rejected-ads';

export interface NavigationContext {
  from?: AdStatusPage;
  adType: AdType;
  adId: string;
}

export interface FlatCategory {
  id: string;
  name: string;
}
