import { Role } from "../enum/roles.enum";
import { Media } from "./media";

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  secondary_number?: string;
  role: Role;
  isActive: boolean;
  phone_verified: boolean;
  admin: Admin | null;
  created_at: Date;
  updated_at: Date;
}

export interface Admin {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  created_at: Date;
  updated_at: Date;
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
