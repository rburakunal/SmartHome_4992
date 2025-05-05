import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { authService } from '../../../service/api';
import { router } from 'expo-router';

export default function PinScreen() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const [hasExistingPin, setHasExistingPin] = useState(false);

  useEffect(() => {
    // Check if user has an existing PIN
    const checkExistingPin = async () => {
      try {
        const { hasPin } = await authService.checkPinStatus();
        setHasExistingPin(hasPin);
      } catch (err) {
        console.error('Error checking PIN status:', err);
      }
    };
    checkExistingPin();
  }, []);

  const validatePin = (pin: string) => {
    return /^\d{4}$/.test(pin);
  };

  const resetForm = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setError('');
    setInputKey(prev => prev + 1);
  };

  const handleSubmit = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (hasExistingPin && !currentPin) {
      setError('Current PIN is required');
      return;
    }

    if (!newPin || !confirmPin) {
      setError('New PIN and confirmation are required');
      return;
    }

    if (!validatePin(newPin) || (hasExistingPin && !validatePin(currentPin)) || !validatePin(confirmPin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }

    try {
      await authService.updatePin(currentPin, newPin);
      Alert.alert(
        'Success',
        'PIN successfully changed',
        [{ text: 'OK' }]
      );
      // Navigate back after 1 second
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to change PIN. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.form} key={inputKey}>
          {hasExistingPin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current PIN</Text>
              <TextInput
                key="current-pin"
                style={styles.input}
                value={currentPin}
                onChangeText={setCurrentPin}
                placeholder="Enter current PIN"
                placeholderTextColor="#999"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New PIN</Text>
            <TextInput
              key="new-pin"
              style={styles.input}
              value={newPin}
              onChangeText={setNewPin}
              placeholder="Enter new PIN"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New PIN</Text>
            <TextInput
              key="confirm-pin"
              style={styles.input}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm new PIN"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>{hasExistingPin ? 'Change PIN' : 'Set PIN'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  form: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
}); 