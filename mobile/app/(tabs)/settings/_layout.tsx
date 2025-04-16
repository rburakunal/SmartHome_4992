import { Stack } from 'expo-router';
import { Colors } from '../../../constants/Colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: Colors.light.tint,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="preferences"
        options={{
          title: 'App Preferences',
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: 'Security',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About / Help',
        }}
      />
    </Stack>
  );
} 