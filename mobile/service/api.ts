import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import { LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    // Network error (no connection to server)
    if (!error.response) {
      const errorResponse: AuthError = {
        message: 'Network error - unable to connect to server. Please check your internet connection or server availability.',
        error: error
      };
      return Promise.reject(errorResponse);
    }
    
    // Server response with error status
    const errorResponse: AuthError = {
      message: error.response?.data?.message || `Error ${error.response.status}: ${error.response.statusText}`,
      error: error.response?.data
    };
    return Promise.reject(errorResponse);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );
      
      // Store the token
      await AsyncStorage.setItem('auth_token', data.token);
      
      // After successful login, get user info
      try {
        // Get user data using the token we just got
        const userResponse = await api.get(
          `${API_CONFIG.ENDPOINTS.USER}`,
          { headers: { Authorization: `Bearer ${data.token}` } }
        );
        
        // Store user info for offline access
        if (userResponse.data && userResponse.data.length > 0) {
          const userData = userResponse.data.find((user: any) => user.role === data.role);
          if (userData) {
            await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data after login:', error);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    try {
      const { data } = await api.post<{ message: string }>(
        API_CONFIG.ENDPOINTS.REGISTER,
        credentials
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};
