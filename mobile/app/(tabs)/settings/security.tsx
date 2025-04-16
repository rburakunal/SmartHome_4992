import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function SecuritySettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Security Settings</Text>
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