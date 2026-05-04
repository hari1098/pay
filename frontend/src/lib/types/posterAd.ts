import { MainCategory, SubCategory } from "./category";
import { Payment } from "./payment";
import { Media } from "./media";
import { Customer } from "./user";
import { AdPosition } from "./videoAd";

export interface PosterAd {
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
