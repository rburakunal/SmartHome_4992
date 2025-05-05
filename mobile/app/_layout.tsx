import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceProvider } from '@/context/DeviceContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DeviceProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-device" options={{ headerShown: false }} />
        </Stack>
      </DeviceProvider>
    </SafeAreaProvider>
  );
}
