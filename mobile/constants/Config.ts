import { Platform } from 'react-native';

// API configuration

// Replace this with your computer's IP address on your local network
// You can find this by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
const YOUR_COMPUTER_IP = '192.168.1.X'; // REPLACE THIS WITH YOUR ACTUAL IP!

// For Android emulators, 10.0.2.2 points to the host machine's localhost
// For iOS simulators, localhost works fine
// For physical devices, you need to use your computer's actual IP address on the local network
let baseUrl = 'http://localhost:3000'; // Default for iOS simulator

if (Platform.OS === 'android') {
  // Check if running in an emulator (10.0.2.2) or on a physical device (use actual IP)
  baseUrl = 'http://10.0.2.2:3000'; // Works for Android emulator
}

// Uncomment the line below if testing on a physical device
// baseUrl = `http://${YOUR_COMPUTER_IP}:3000`;

export const API_URL = baseUrl; 