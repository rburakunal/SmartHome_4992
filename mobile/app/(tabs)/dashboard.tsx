import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

interface SensorData {
  movement: boolean;
  distance: number;
  gasLevel: number;
  temperature: number;
  humidity: number;
  doorStatus: 'locked' | 'unlocked';
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
  const [sensorData, setSensorData] = useState<SensorData>({
    movement: false,
    distance: 0,
    gasLevel: 0,
    temperature: 24,
    humidity: 45,
    doorStatus: 'locked',
  });

  const [refreshing, setRefreshing] = useState(false);
  const [temperatureHistory, setTemperatureHistory] = useState<number[]>([24, 23, 25, 24, 23, 24]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new data
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
      <View style={styles.cardHeader}>
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Real-time sensor data</Text>
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

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Temperature History</Text>
        <LineChart
          data={{
            labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
            datasets: [{
              data: temperatureHistory
            }]
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chart}
          bezier
        />
      </View>
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
  cardHeader: {
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
  chartContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
