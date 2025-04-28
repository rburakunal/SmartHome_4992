import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import Toast from '../../../components/Toast';

interface FormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettings() {
  const [formData, setFormData] = useState<FormData>({
    name: 'John Doe', // Placeholder data
    email: 'john.doe@example.com', // Placeholder data
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [activeSection, setActiveSection] = useState<'details' | 'email' | 'password'>('details');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (section: 'details' | 'email' | 'password') => {
    // Validate inputs
    if (section === 'email' || section === 'password') {
      if (!formData.currentPassword) {
        alert('Current password is required');
        return;
      }
    }

    if (section === 'password') {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
    }

    setToastMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
    setShowToast(true);

    // Reset form fields
    if (section === 'password') {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };

  const renderDetailsSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Name</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>{formData.name}</Text>
      </View>
      <Text style={styles.label}>Email</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.readOnlyText}>{formData.email}</Text>
      </View>
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

        <Toast
          visible={showToast}
          message={toastMessage}
          onHide={() => setShowToast(false)}
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
}); 