import { Media } from "./media";

export interface Payment {
  id: string;
  created_at: Date;
  updated_at: Date;
  method: string;
  amount: string;
  details: string;
  proof: Media;
}
