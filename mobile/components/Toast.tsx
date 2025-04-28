import React, { useEffect } from 'react';
import { StyleSheet, Animated, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  type?: 'success' | 'error';
  duration?: number;
}

export default function Toast({ 
  visible, 
  message, 
  onHide, 
  type = 'success',
  duration = 3000 
}: ToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity },
        type === 'error' ? styles.errorContainer : styles.successContainer
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successContainer: {
    backgroundColor: Colors.light.tint,
  },
  errorContainer: {
    backgroundColor: '#ff4444',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
}); 