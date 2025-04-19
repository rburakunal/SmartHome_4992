export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'user' | 'admin';
}

export interface AuthError {
  message: string;
  error?: any;
} 