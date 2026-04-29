import { AdType } from '../enum/ad-type';
import { PageType } from '../enum/page-type';
import { PositionType } from '../enum/position-type';

export interface AdPosition {
  id: string;
  adType: AdType;
  pageType: PageType;
  side?: PositionType;
  position: number; 
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdPositionDto {
  adType: AdType;
  pageType?: PageType;
  side?: PositionType;
  position: number; 
}

export interface UpdateAdPositionDto {
  adType?: AdType;
  pageType?: PageType;
  side?: PositionType;
  position?: number;
}