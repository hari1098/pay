export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  phoneVerified: boolean;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LineAd {
  id: string;
  content: string;
  mainCategory: Category;
  categoryOne?: Category;
  categoryTwo?: Category;
  categoryThree?: Category;
  state: string;
  city: string;
  postedBy: string;
  contactOne: string;
  contactTwo?: string;
  backgroundColor?: string;
  textColor?: string;
  status: string;
  isActive: boolean;
  images: Image[];
  dates: string[];
  createdAt: string;
}

export interface PosterAd {
  id: string;
  mainCategory: Category;
  categoryOne?: Category;
  image?: Image;
  images: Image[];
  state: string;
  city: string;
  postedBy: string;
  status: string;
  isActive: boolean;
  dates: string[];
  position?: AdPosition;
  createdAt: string;
}

export interface VideoAd {
  id: string;
  mainCategory: Category;
  categoryOne?: Category;
  image?: Image;
  images: Image[];
  state: string;
  city: string;
  postedBy: string;
  status: string;
  isActive: boolean;
  dates: string[];
  position?: AdPosition;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  children?: Category[];
  subCategories?: Category[];
}

export interface Image {
  id: string;
  fileName: string;
  filePath: string;
}

export interface AdPosition {
  id: string;
  pageType: string;
  side: string;
  position: number;
}

export interface DashboardStats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  totalViews: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  companyName?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SearchSlogan {
  primarySlogan: string;
  secondarySlogan: string;
}
