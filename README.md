# Smart Home App

This is a smart home management application with a mobile frontend, backend server, and ESP32-based IoT integration.

## Get started

1. Install dependencies for both frontend and backend

   ```bash
   # Install frontend dependencies
   cd mobile
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **IMPORTANT: Configure your API connection**

   Before starting the app, you must configure the API connection in `mobile/service/config.ts`:
   - Open the file and set the `BASE_URL` to your local IP address
   - For iOS physical devices with Expo Go, use: `http://YOUR_IP_ADDRESS:3000`
   - Replace `YOUR_IP_ADDRESS` with your actual network IP address

3. Start the complete development environment (both backend and frontend)

   ```bash
   # From the mobile directory
   npm run dev
   ```

   This command will:
   - Start the backend server first (on port 3000)
   - Wait until the backend is running
   - Then automatically start the Expo development server

   You'll see logs from both systems in one terminal.

4. Alternative: Start frontend and backend separately

   If you prefer to run them in separate terminals:

   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev

   # Terminal 2 - Start frontend
   cd mobile
   npx expo start
   ```

## Development Notes

- The mobile app requires the backend server to be running
- Backend server runs on port 3000
- MongoDB Atlas is used for the database
- API configuration is in `mobile/service/config.ts`
- MQTT broker runs on ports:
  - 1883 (non-secure)
  - 8883 (secure, requires SSL/TLS certificates)

## ESP32 Integration

The system includes an ESP32 microcontroller that manages various sensors and actuators:

### Sensors
- Temperature and Humidity (DHT11)
- Gas Detection
- Motion Detection (PIR)
- Light Level

### Actuators
- Door Control (Servo)
- Fan Control (Relay)
- Garage Door (Servo)
- Curtain Control (Servo)

### MQTT Topics

The ESP32 communicates with the system using the following MQTT topics:

#### Sensors
- `home/sensors/temperature` - Temperature readings
- `home/sensors/humidity` - Humidity readings
- `home/sensors/gas` - Gas detection status
- `home/sensors/motion` - Motion detection status
- `home/sensors/light` - Light level readings

#### Controls
- `home/controls/door` - Door control commands
- `home/controls/fan` - Fan control commands
- `home/controls/garage` - Garage door control commands
- `home/controls/curtain` - Curtain control commands

#### Status
- `home/status/door` - Door status updates
- `home/status/fan` - Fan status updates
- `home/status/garage` - Garage door status updates
- `home/status/curtain` - Curtain status updates

### SSL/TLS Certificates

To enable secure MQTT communication:

1. Generate SSL/TLS certificates and place them in `backend/certs/`:
   - `server-key.pem` - Server private key
   - `server-cert.pem` - Server certificate

2. Update the ESP32 code with the correct certificate if needed

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
