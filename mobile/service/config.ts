export const API_CONFIG = {
  // For Android emulator, use 10.0.2.2 which points to your host machine's localhost
  // BASE_URL: 'http://10.0.2.2:5000',
  
  // For iOS simulator:
  // BASE_URL: 'http://localhost:5000',
  
  // For iOS physical devices, try this IPv4 format which sometimes works better
  BASE_URL: 'http://192.168.1.197:5000',
  
  // Alternative options (uncomment to try):
  // BASE_URL: 'http://[::1]:5000', // IPv6 localhost
  // BASE_URL: 'http://localhost:5000', // For iOS simulator
  // BASE_URL: 'http://10.0.2.2:5000', // For Android emulator
  
  // Test backend running on Render or other cloud service:
  // BASE_URL: 'https://smart-home-backend.onrender.com',
  
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DEVICES: '/cihaz',
    ALERTS: '/alertlar',
    NOTIFICATIONS: '/bildirim',
    USER: '/kullanicilar'
  },
  TIMEOUT: 30000, // 30 seconds
}; 