import { AdStatus } from "../enum/ad-status";
import { LineAd } from "./lineAd";
import { PosterAd } from "./posterAd";
import { User } from "./user";

export type AdComment = {
  id: number;
  created_at: Date;
  actionType: AdStatus;
  comment: string; 
  actionTimestamp: Date;
  lineAd: LineAd;
  posterAd: PosterAd;

  user: User;
  isActive: boolean;
};
