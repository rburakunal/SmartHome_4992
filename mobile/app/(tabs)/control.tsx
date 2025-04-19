import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface ControlSettings {
  temperature: number;
  humidity: number;
  lightIntensity: number;
  isAlarmEnabled: boolean;
  isAutoMode: boolean;
  isNightMode: boolean;
}

export default function ControlScreen() {
  const [settings, setSettings] = useState<ControlSettings>({
    temperature: 22,
    humidity: 45,
    lightIntensity: 50,
    isAlarmEnabled: true,
    isAutoMode: true,
    isNightMode: false,
  });

  const updateSetting = (key: keyof ControlSettings, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const ControlCard = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    children: React.ReactNode 
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Control Panel</Text>
        <Text style={styles.subtitle}>Adjust your home settings</Text>
      </View>

      <ControlCard title="Temperature Control" icon="thermometer">
        <View style={styles.sliderContainer}>
          <Text style={styles.valueText}>{settings.temperature}°C</Text>
          <Slider
            style={styles.slider}
            minimumValue={16}
            maximumValue={30}
            value={settings.temperature}
            onValueChange={(value) => updateSetting('temperature', value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#E5E5EA"
            thumbTintColor="#007AFF"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>16°C</Text>
            <Text style={styles.sliderLabel}>30°C</Text>
          </View>
        </View>
      </ControlCard>

      <ControlCard title="Humidity Control" icon="water">
        <View style={styles.sliderContainer}>
          <Text style={styles.valueText}>{settings.humidity}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={70}
            value={settings.humidity}
            onValueChange={(value) => updateSetting('humidity', value)}
            minimumTrackTintColor="#5856D6"
            maximumTrackTintColor="#E5E5EA"
            thumbTintColor="#5856D6"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>30%</Text>
            <Text style={styles.sliderLabel}>70%</Text>
          </View>
        </View>
      </ControlCard>

      <ControlCard title="Light Intensity" icon="sunny">
        <View style={styles.sliderContainer}>
          <Text style={styles.valueText}>{settings.lightIntensity}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={settings.lightIntensity}
            onValueChange={(value) => updateSetting('lightIntensity', value)}
            minimumTrackTintColor="#FF9500"
            maximumTrackTintColor="#E5E5EA"
            thumbTintColor="#FF9500"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0%</Text>
            <Text style={styles.sliderLabel}>100%</Text>
          </View>
        </View>
      </ControlCard>

      <ControlCard title="System Settings" icon="settings">
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Alarm System</Text>
          <Switch
            value={settings.isAlarmEnabled}
            onValueChange={(value) => updateSetting('isAlarmEnabled', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.isAlarmEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Auto Mode</Text>
          <Switch
            value={settings.isAutoMode}
            onValueChange={(value) => updateSetting('isAutoMode', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.isAutoMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Night Mode</Text>
          <Switch
            value={settings.isNightMode}
            onValueChange={(value) => updateSetting('isNightMode', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.isNightMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </ControlCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  sliderContainer: {
    marginVertical: 10,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});
