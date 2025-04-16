import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function AppPreferences() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>App Preferences</Text>
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