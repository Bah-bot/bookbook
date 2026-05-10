export interface User {
  id: number;
  email: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Profile {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  userId?: number;
}