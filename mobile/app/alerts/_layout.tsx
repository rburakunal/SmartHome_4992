import { Stack } from 'expo-router';

export default function AlertsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Alerts',
        }}
      />
    </Stack>
  );
}