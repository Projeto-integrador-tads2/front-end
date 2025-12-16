export interface LoginResponse {
    token: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    message: string;
}

export interface LoginError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}
export interface RegisterError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
