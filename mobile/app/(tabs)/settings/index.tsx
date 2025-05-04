import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const SettingItem = ({ title, icon, onPress }: SettingItemProps) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
  >
    <View style={styles.settingItemContent}>
      <Ionicons name={icon} size={24} color={Colors.light.tint} style={styles.icon} />
      <Text style={styles.settingItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#666" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <SettingItem
          title="Account"
          icon="person-outline"
          onPress={() => router.push('/(tabs)/settings/account')}
        />
        <SettingItem
          title="Notification Settings"
          icon="notifications-outline"
          onPress={() => router.push('/(tabs)/settings/notifications')}
        />
        <SettingItem
          title="Change PIN"
          icon="key-outline"
          onPress={() => router.push('/(tabs)/settings/pin')}
        />
        <SettingItem
          title="About / Help"
          icon="information-circle-outline"
          onPress={() => router.push('/(tabs)/settings/about')}
        />
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.logoutButton]}
          onPress={() => {
            // For now, just navigate to login
            router.replace('/login');
          }}
        >
          <View style={styles.settingItemContent}>
            <Ionicons name="log-out-outline" size={24} color="#ff3b30" style={styles.icon} />
            <Text style={[styles.settingItemText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    color: '#ff3b30',
  },
}); 