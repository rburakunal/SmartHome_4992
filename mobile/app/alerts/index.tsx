import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import Header from '@/components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useAlerts } from '@/context/AlertsContext';

interface AlertItemProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  severity: 'warning' | 'danger' | 'info';
  onDelete: () => void;
}

const AlertItem = ({ title, description, icon, onPress, severity, onDelete }: AlertItemProps) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'warning':
        return '#FF9500';
      case 'danger':
        return '#FF3B30';
      case 'info':
        return '#007AFF';
      default:
        return '#007AFF';
    }
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={onDelete}
      >
        <Animated.View
          style={[
            styles.deleteActionContent,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Ionicons name="trash" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <TouchableOpacity style={styles.alertItem} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: getSeverityColor() }]}>
          <Ionicons name={icon} size={24} color="white" />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { alerts, deleteAlert } = useAlerts();

  const alertsWithNavigation = alerts.map(alert => ({
    ...alert,
    onPress: () => {
      if (alert.id === 'temperature') {
        router.push('/(tabs)/control');
      } else {
        router.push('/(tabs)/dashboard');
      }
    },
  }));

  return (
    <View style={styles.container}>
      <Header />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title}>Alerts</Text>
        <ScrollView style={styles.scrollView}>
          {alertsWithNavigation.map((alert) => (
            <AlertItem
              key={alert.id}
              title={alert.title}
              description={alert.description}
              icon={alert.icon as keyof typeof Ionicons.glyphMap}
              onPress={alert.onPress}
              severity={alert.severity}
              onDelete={() => deleteAlert(alert.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '87%',
    borderRadius: 12,
    marginBottom: 12,
  },
  deleteActionContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 37,
  },
});
