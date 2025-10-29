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
