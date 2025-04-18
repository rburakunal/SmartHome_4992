import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
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

  const [activeSection, setActiveSection] = useState<'name' | 'email' | 'password'>('name');
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (section: 'name' | 'email' | 'password') => {
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

    // Handle different section saves
    if (section === 'email') {
      setShowEmailVerificationModal(true);
    } else {
      setToastMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
      setShowToast(true);
    }

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

  const renderNameSection = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        placeholder="Enter your name"
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handleSave('name')}
      >
        <Text style={styles.saveButtonText}>Save Name</Text>
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
            style={[styles.tab, activeSection === 'name' && styles.activeTab]}
            onPress={() => setActiveSection('name')}
          >
            <Text style={[styles.tabText, activeSection === 'name' && styles.activeTabText]}>
              Name
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
          {activeSection === 'name' && renderNameSection()}
          {activeSection === 'email' && renderEmailSection()}
          {activeSection === 'password' && renderPasswordSection()}
        </ScrollView>

        <Modal
          visible={showEmailVerificationModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Verify Your Email</Text>
              <Text style={styles.modalText}>
                A verification email has been sent to your new email address. Please check your inbox and follow the instructions to verify your email.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowEmailVerificationModal(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 