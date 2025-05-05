import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDevice } from '@/context/DeviceContext';

interface SensorData {
  movement: boolean;
  distance: number;
  gasLevel: number;
  temperature: number;
  humidity: number;
  doorStatus: 'locked' | 'unlocked';
  alarmStatus: 'armed' | 'disarmed';
  mainDoorLock: boolean;
  garageDoor: boolean;
  curtain: boolean;
  kitchenFan: boolean;
}

interface SensorCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  unit?: string;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { deviceState } = useDevice();
  const [sensorData, setSensorData] = useState<SensorData>({
    movement: false,
    distance: 0,
    gasLevel: 0,
    temperature: 24,
    humidity: 45,
    doorStatus: 'locked',
    alarmStatus: 'armed',
    mainDoorLock: true,
    garageDoor: true,
    curtain: false,
    kitchenFan: false,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSensorData(prev => ({
        ...prev,
        temperature: Math.random() * 10 + 20,
        humidity: Math.random() * 30 + 30,
        gasLevel: Math.random() * 50,
      }));
      setRefreshing(false);
    }, 2000);
  }, []);

  const SensorCard = ({ title, value, icon, unit = '', color = '#007AFF', trend }: SensorCardProps) => (
    <View style={styles.card}>
      <View style={styles.sensorCardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
        {trend && (
          <Ionicons 
            name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'remove'} 
            size={16} 
            color={trend === 'up' ? '#34C759' : trend === 'down' ? '#FF3B30' : '#666'} 
          />
        )}
      </View>
      <Text style={[styles.cardValue, { color }]}>
        {value}{unit}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sensorSection}>
          <Text style={styles.sectionTitle}>Real-time sensor data</Text>
        </View>

        <View style={styles.grid}>
          <SensorCard
            title="Temperature"
            value={sensorData.temperature.toFixed(1)}
            icon="thermometer"
            unit="°C"
            color="#FF9500"
            trend="up"
          />
          
          <SensorCard
            title="Humidity"
            value={sensorData.humidity.toFixed(1)}
            icon="water"
            unit="%"
            color="#5856D6"
            trend="stable"
          />

          <SensorCard
            title="Gas Level"
            value={sensorData.gasLevel.toFixed(1)}
            icon="warning"
            unit=" ppm"
            color={sensorData.gasLevel > 100 ? "#FF3B30" : "#34C759"}
            trend="down"
          />

          <SensorCard
            title="Movement"
            value={sensorData.movement ? "Detected" : "No Movement"}
            icon="walk"
            color={sensorData.movement ? "#FF3B30" : "#34C759"}
          />
        </View>

        <View style={styles.alarmContainer}>
          <Text style={styles.sectionTitle}>Device Status</Text>
          <View style={styles.grid}>
            <SensorCard
              title="Alarm System"
              value={deviceState.alarmSystem ? "Armed" : "Disarmed"}
              icon="shield"
              color={deviceState.alarmSystem ? "#34C759" : "#FF3B30"}
            />
            <SensorCard
              title="Main Door"
              value={deviceState.mainDoorLock ? "Locked" : "Unlocked"}
              icon="lock-closed"
              color={deviceState.mainDoorLock ? "#34C759" : "#FF3B30"}
            />
            <SensorCard
              title="Garage Door"
              value={deviceState.garageDoor ? "Closed" : "Open"}
              icon="car"
              color={deviceState.garageDoor ? "#34C759" : "#FF3B30"}
            />
            <SensorCard
              title="Curtains"
              value={deviceState.curtain ? "Open" : "Closed"}
              icon="sunny"
              color={deviceState.curtain ? "#FF9500" : "#8E8E93"}
            />
            <SensorCard
              title="Kitchen Fan"
              value={deviceState.kitchenFan ? "On" : "Off"}
              icon="power"
              color={deviceState.kitchenFan ? "#5856D6" : "#8E8E93"}
            />
          </View>
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
  sensorSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sensorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#666',
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  alarmContainer: {
    padding: 20,
  },
  alarmCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alarmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  }
});

