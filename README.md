# Smart Home App

This is a smart home management application with a mobile frontend and backend server.

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

2. Start the complete development environment (both backend and frontend)

   ```bash
   # From the mobile directory
   npm run dev
   ```

   This command will:
   - Start the backend server first
   - Wait until the backend is running
   - Then automatically start the Expo development server

   You'll see logs from both systems in one terminal.

3. Alternative: Start frontend and backend separately

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
- Backend server runs on port 5000
- MongoDB Atlas is used for the database
- API configuration is in `mobile/service/config.ts`

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
