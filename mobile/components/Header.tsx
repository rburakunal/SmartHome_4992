import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  showAddButton?: boolean;
}

export default function Header({ showAddButton = true }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleLogoPress = () => {
    router.push('/(tabs)/dashboard');
  };

  const handleAddDevicePress = () => {
    router.push('/add-device');
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
        
        {showAddButton && (
          <TouchableOpacity onPress={handleAddDevicePress} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color={tintColor} />
            <Text style={[styles.addButtonText, { color: tintColor }]}>Add Device</Text>
          </TouchableOpacity>
        )}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: '500',
  },
});
