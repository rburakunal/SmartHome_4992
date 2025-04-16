import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Text,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // For now, just navigate back to login screen
    router.replace('/login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Image
            source={require('../assets/images/smart-home-logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join to control your smart home</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
              returnKeyType="next"
              autoCorrect={false}
              textContentType="emailAddress"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
              returnKeyType="next"
              textContentType="newPassword"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#666"
              returnKeyType="done"
              textContentType="newPassword"
              onSubmitEditing={handleSignUp}
            />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginButton}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  loginButton: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 