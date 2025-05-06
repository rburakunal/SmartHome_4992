import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useFixedThemeColor } from '@/hooks/useFixedThemeColor';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddDeviceScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useFixedThemeColor({}, 'background');
  const textColor = useFixedThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text style={[styles.title, { color: textColor }]}>Add Device</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          This page will allow you to add new devices to your smart home.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 