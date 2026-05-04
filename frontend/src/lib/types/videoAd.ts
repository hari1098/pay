import { MainCategory, SubCategory } from "./category";
import { Payment } from "./payment";
import { Media } from "./media";
import { Customer } from "./user";

export interface AdPosition {
  id: string;
  adType: 'VIDEO' | 'POSTER' | 'LINE';
  pageType: 'HOME' | 'CATEGORY';
  side: 'LEFT_SIDE' | 'RIGHT_SIDE' | 'CENTER_TOP' | 'CENTER_BOTTOM';
  position: number; 
}

export interface VideoAd {
  id: string;
  sequenceNumber: number;
  orderId?: number;
  mainCategory: MainCategory;
  categoryOne?: SubCategory;
  categoryTwo?: SubCategory;
  categoryThree?: SubCategory;
  image: Media;
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
  position: AdPosition;
}
