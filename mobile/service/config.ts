export const API_CONFIG = {
  // IMPORTANT: Before running the app, replace the empty BASE_URL with your IP address
  // Examples:
  // - For Android emulator, use: 'http://10.0.2.2:3000'
  // - For iOS simulator, use: 'http://localhost:3000'
  // - For iOS physical devices in Expo Go, use your local IP: 'http://192.168.1.X:3000'
  //   (Replace X with your specific IP address segment)
  BASE_URL: 'http://:3000',
  
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