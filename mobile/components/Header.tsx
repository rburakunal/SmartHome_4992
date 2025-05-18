import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFixedThemeColor } from '@/hooks/useFixedThemeColor';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  showAddButton?: boolean;
}

export default function Header({ showAddButton = true }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tintColor = useFixedThemeColor({}, 'tint');
  const backgroundColor = useFixedThemeColor({}, 'background');

  const handleLogoPress = () => {
    router.push('/(tabs)/dashboard');
  };

  const handleProfilePress = () => {
    router.push('/settings/account');
  };

  const handleAlertsPress = () => {
    router.push('/alerts');
  };

  return (
    <View style={[
      styles.headerContainer, 
      { 
        backgroundColor,
        paddingTop: insets.top,
      }
    ]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLogoPress} style={styles.logoContainer}>
          <Ionicons name="home" size={24} color={tintColor} style={styles.homeIcon} />
          <Text style={[styles.logoText, { color: tintColor }]}>Smart Home</Text>
        </TouchableOpacity>
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={handleAlertsPress} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color={tintColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={28} color={tintColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: '500',
  },
});
