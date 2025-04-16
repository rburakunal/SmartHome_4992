import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function NotificationSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notification Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
}); 