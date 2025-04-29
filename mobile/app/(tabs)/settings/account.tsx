import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import Toast from '../../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../../service/config';
import axios from 'axios';

interface FormData {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Create API instance with interceptors
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function AccountSettings() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'details' | 'email' | 'password'>('details');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadUserData();
  }, []);

  // Get current user data with username from the update profile endpoint
  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data from API...');
      
      // Get current email from AsyncStorage first
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      let currentEmail = '';
      
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          currentEmail = userInfo.email || '';
        } catch (err) {
          console.error('Error parsing user info:', err);
        }
      }
      
      if (!currentEmail) {
        console.error('No email found in storage, cannot fetch user data');
        setLoading(false);
        return null;
      }
      
      // Use the email update endpoint - this will return full user data
      const response = await api.put(
        `${API_CONFIG.ENDPOINTS.USER}/guncelle`,
        { email: currentEmail }
      );
      
      console.log('User data response:', JSON.stringify(response.data));
      
      if (response.data && response.data.user) {
        // Save the complete user info to storage
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      console.log(`Attempting to load user data...`);
      setLoading(true);
      
      // Try to fetch user data from API first
      let userData = await fetchUserData();
      
      // If API failed, try to get stored data
      if (!userData) {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        console.log('User info from storage:', userInfoStr);
        
        if (userInfoStr) {
          userData = JSON.parse(userInfoStr);
          
          // If username is missing but we have email, extract username from email
          if (!userData.username && userData.email) {
            // Extract username as everything before @ in email
            userData.username = userData.email.split('@')[0];
          }
        }
      }
      
      if (userData) {
        setFormData(prev => ({
          ...prev,
          username: userData.username || '',
          email: userData.email || '',
        }));
        
        console.log('Set user data:', userData.username, userData.email);
      } else {
        showToastMessage('Could not retrieve user information', 'error');
      }
    } catch (error: any) {
      console.error('Error loading user data:', error.message);
      showToastMessage('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSave = async (section: 'details' | 'email' | 'password') => {
    try {
      setLoading(true);

      // Validate inputs
      if (section === 'password') {
        if (formData.newPassword !== formData.confirmPassword) {
          showToastMessage('New passwords do not match', 'error');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          showToastMessage('Password must be at least 6 characters long', 'error');
          setLoading(false);
          return;
        }
      }

      const updateData: any = {};
      
      if (section === 'email') {
        if (!formData.email) {
          showToastMessage('Email is required', 'error');
          setLoading(false);
          return;
        }
        updateData.email = formData.email;
      } else if (section === 'password') {
        if (!formData.newPassword) {
          showToastMessage('New password is required', 'error');
          setLoading(false);
          return;
        }
        updateData.password = formData.newPassword;
      }

      console.log('Updating profile with data:', JSON.stringify(updateData));
      
      // Call backend updateProfile endpoint
      const response = await api.put(
        `${API_CONFIG.ENDPOINTS.USER}/guncelle`,
        updateData
      );

      console.log('Update response:', JSON.stringify(response.data));
      
      // Update local storage with updated user info
      if (response.data.user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        // Reload user data to reflect changes
        loadUserData();
      }

      showToastMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);

      // Reset form fields
      if (section === 'password') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Username</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>
          {formData.username || 'Loading...'}
        </Text>
      </View>
      <Text style={styles.label}>Email</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>
          {formData.email || 'Loading...'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.saveButton, { marginTop: 20 }]}
        onPress={loadUserData}
      >
        <Text style={styles.saveButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmailSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>New Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        placeholder="Enter new email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleSave('email')}
      >
        <Text style={styles.saveButtonText}>Save Email</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={formData.newPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
        placeholder="Enter new password"
        secureTextEntry
      />
      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
        placeholder="Confirm new password"
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleSave('password')}
      >
        <Text style={styles.saveButtonText}>Save Password</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'details' && styles.activeTab]}
            onPress={() => setActiveSection('details')}
          >
            <Text style={[styles.tabText, activeSection === 'details' && styles.activeTabText]}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'email' && styles.activeTab]}
            onPress={() => setActiveSection('email')}
          >
            <Text style={[styles.tabText, activeSection === 'email' && styles.activeTabText]}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeSection === 'password' && styles.activeTab]}
            onPress={() => setActiveSection('password')}
          >
            <Text style={[styles.tabText, activeSection === 'password' && styles.activeTabText]}>
              Password
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {activeSection === 'details' && renderDetailsSection()}
          {activeSection === 'email' && renderEmailSection()}
          {activeSection === 'password' && renderPasswordSection()}
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
          </View>
        )}

        <Toast
          visible={showToast}
          message={toastMessage}
          onHide={() => setShowToast(false)}
          type={toastType}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.tint,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  readOnlyField: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: Colors.light.tint,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
}); 