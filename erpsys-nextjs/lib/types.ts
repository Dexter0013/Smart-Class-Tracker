export type Role = "ADMIN" | "STUDENT" | "INSTRUCTOR";

export interface AuthPayload {
  userId: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: Role;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
