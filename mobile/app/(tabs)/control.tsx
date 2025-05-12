import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDevice } from '@/context/DeviceContext';

interface SwitchProps {
  label: string;
  initialState?: boolean;
}

interface ControlCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

// Simple independent switch component
const SimpleSwitch = ({ label, initialState = false }: SwitchProps) => {
  const [isOn, setIsOn] = useState(initialState);
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>{label}</Text>
      <Switch
        value={isOn}
        onValueChange={setIsOn}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isOn ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const AlarmSwitch = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Alarm System</Text>
      <Switch
        value={deviceState.alarmSystem}
        onValueChange={(value) => updateDeviceState('alarmSystem', value)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={deviceState.alarmSystem ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const MainDoorSwitch = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Main Door Lock</Text>
      <Switch
        value={deviceState.mainDoorLock}
        onValueChange={(value) => updateDeviceState('mainDoorLock', value)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={deviceState.mainDoorLock ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const GarageDoorSwitch = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Garage Door</Text>
      <Switch
        value={deviceState.garageDoor}
        onValueChange={(value) => updateDeviceState('garageDoor', value)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={deviceState.garageDoor ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const CurtainSwitch = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Curtain</Text>
      <Switch
        value={deviceState.curtain}
        onValueChange={(value) => updateDeviceState('curtain', value)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={deviceState.curtain ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const KitchenFanSwitch = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Kitchen Exhaust Fan</Text>
      <Switch
        value={deviceState.kitchenFan}
        onValueChange={(value) => updateDeviceState('kitchenFan', value)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={deviceState.kitchenFan ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );
};

const TemperatureSlider = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.valueText}>{Math.round(deviceState.temperature || 22)}°C</Text>
      <Slider
        style={styles.slider}
        minimumValue={16}
        maximumValue={30}
        value={deviceState.temperature || 22}
        onValueChange={(value) => updateDeviceState('temperature', value)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5EA"
        thumbTintColor="#007AFF"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>16°C</Text>
        <Text style={styles.sliderLabel}>30°C</Text>
      </View>
    </View>
  );
};

const HumiditySlider = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.valueText}>{Math.round(deviceState.humidity || 45)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={30}
        maximumValue={70}
        value={deviceState.humidity || 45}
        onValueChange={(value) => updateDeviceState('humidity', value)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5EA"
        thumbTintColor="#007AFF"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>30%</Text>
        <Text style={styles.sliderLabel}>70%</Text>
      </View>
    </View>
  );
};

const LightSlider = () => {
  const { deviceState, updateDeviceState } = useDevice();
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.valueText}>{Math.round(deviceState.light || 50)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={deviceState.light || 50}
        onValueChange={(value) => updateDeviceState('light', value)}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5EA"
        thumbTintColor="#007AFF"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>0%</Text>
        <Text style={styles.sliderLabel}>100%</Text>
      </View>
    </View>
  );
};

export default function ControlScreen() {
  const insets = useSafeAreaInsets();
  
  const ControlCard = ({ title, icon, children }: ControlCardProps) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ 
          paddingBottom: insets.bottom 
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Control Panel</Text>

          <ControlCard title="Temperature Control" icon="thermometer">
            <TemperatureSlider />
          </ControlCard>

          <ControlCard title="Humidity Control" icon="water">
            <HumiditySlider />
          </ControlCard>

          <ControlCard title="Light Intensity" icon="sunny">
            <LightSlider />
          </ControlCard>

          <ControlCard title="System Controls" icon="settings">
            <AlarmSwitch />
            <MainDoorSwitch />
            <GarageDoorSwitch />
            <CurtainSwitch />
            <KitchenFanSwitch />
          </ControlCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
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
