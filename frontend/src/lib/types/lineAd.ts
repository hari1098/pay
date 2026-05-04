import { MainCategory, SubCategory } from "./category";
import { Payment } from "./payment";
import { Customer } from "./user";
import { PageType } from "../enum/page-type";

export interface LineAd {
  id: string;
  created_at: Date;
  updated_at: Date;
  sequenceNumber: number;
  orderId: null;
  mainCategory: MainCategory;
  categoryOne: SubCategory;
  categoryTwo: SubCategory;
  categoryThree: SubCategory;
  content: string;
  images: any[];
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
  textColor:string;
  backgroundColor:string;
}
