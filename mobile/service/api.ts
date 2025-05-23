import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config';
import { LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
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
      message: error.response?.data?.error || error.response?.data?.message || `Error ${error.response.status}: ${error.response.statusText}`,
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
      
      // Store minimal user info to have something available offline
      const minimalUserInfo = {
        email: credentials.email,
        role: data.role
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(minimalUserInfo));
      
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
  },
  
  // Add a new function to get the user profile
  getUserProfile: async (): Promise<any> => {
    try {
      const { data } = await api.get(`${API_CONFIG.ENDPOINTS.USER}/profil`);
      
      // Store the user info in AsyncStorage for offline access
      if (data.user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Add PIN update functionality
  updatePin: async (currentPin: string, newPin: string): Promise<{ message: string }> => {
    try {
      const { data } = await api.put(`${API_CONFIG.ENDPOINTS.USER}/pin`, {
        currentPin,
        pin: newPin
      });
      return data;
    } catch (error) {
      console.error('Error updating PIN:', error);
      throw error;
    }
  },

  // Check if user has PIN set
  checkPinStatus: async (): Promise<{ hasPin: boolean }> => {
    try {
      const { data } = await api.get(`${API_CONFIG.ENDPOINTS.USER}/pin/status`);
      return data;
    } catch (error) {
      console.error('Error checking PIN status:', error);
      throw error;
    }
  }
};
