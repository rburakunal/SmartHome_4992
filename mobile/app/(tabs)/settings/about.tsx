import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function AboutHelp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About / Help</Text>
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