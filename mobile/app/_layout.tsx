import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceProvider } from '@/context/DeviceContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertsProvider } from '@/context/AlertsContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DeviceProvider>
          <AlertsProvider>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="alerts" options={{ headerShown: false }} />
            </Stack>
          </AlertsProvider>
        </DeviceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
