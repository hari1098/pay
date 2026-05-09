export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  phoneVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
