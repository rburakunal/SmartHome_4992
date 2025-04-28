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
  Alert,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import Toast from '../../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../../service/config';
import axios from 'axios';

interface FormData {
  name: string;
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
    name: '',
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

  const loadUserData = async () => {
    try {
      console.log(`Fetching user data from ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}/me`);
      
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USER}/me`);
      console.log('User data loaded:', JSON.stringify(response.data));
      
      // The response directly contains the user object
      const userData = response.data;
      
      if (!userData.username && !userData.email) {
        console.error('API returned data but missing username/email:', userData);
        showToastMessage('User data format is invalid', 'error');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        name: userData.username || '',
        email: userData.email || '',
      }));
      
      console.log('User data set:', userData.username, userData.email);
    } catch (error: any) {
      console.error('Error loading user data:', error.response?.data || error.message);
      showToastMessage('Failed to load user data', 'error');
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
      if (section === 'email' || section === 'password') {
        if (!formData.currentPassword) {
          showToastMessage('Current password is required', 'error');
          return;
        }
      }

      if (section === 'password') {
        if (formData.newPassword !== formData.confirmPassword) {
          showToastMessage('New passwords do not match', 'error');
          return;
        }
        if (formData.newPassword.length < 6) {
          showToastMessage('Password must be at least 6 characters long', 'error');
          return;
        }
      }

      const updateData = {};
      if (section === 'email') {
        Object.assign(updateData, { email: formData.email });
      } else if (section === 'password') {
        Object.assign(updateData, { password: formData.newPassword });
      }
      Object.assign(updateData, { currentPassword: formData.currentPassword });

      await api.put(
        `${API_CONFIG.ENDPOINTS.USER}/guncelle`,
        updateData
      );

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
      const errorMessage = error.response?.data?.message || 'An error occurred';
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Name</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>
          {formData.name ? formData.name : 'Loading...'}
        </Text>
      </View>
      <Text style={styles.label}>Email</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>
          {formData.email ? formData.email : 'Loading...'}
        </Text>
      </View>
      
      {/* Debug button in development */}
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
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={formData.currentPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
        placeholder="Enter current password"
        secureTextEntry
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
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={formData.currentPassword}
        onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
        placeholder="Enter current password"
        secureTextEntry
      />
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