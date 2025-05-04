import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function PinScreen() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [inputKey, setInputKey] = useState(0);

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
    if (!currentPin || !newPin || !confirmPin) {
      setError('All fields are required');
      return;
    }

    if (!validatePin(currentPin) || !validatePin(newPin) || !validatePin(confirmPin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }

    try {
      // TODO: Implement API call to change PIN
      // const response = await api.changePin(currentPin, newPin);
      
      // For now, just show a success message
      Alert.alert(
        'Success',
        'PIN successfully changed',
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (err) {
      setError('Failed to change PIN. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.form} key={inputKey}>
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
            <Text style={styles.buttonText}>Change PIN</Text>
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
    marginTop: 20,
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