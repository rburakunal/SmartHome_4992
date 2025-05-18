import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <Header />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.description}>
          You have no active alerts at the moment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
