import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Alert {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: 'warning' | 'danger' | 'info';
  onPress: () => void;
}

interface AlertsContextType {
  alerts: Alert[];
  deleteAlert: (id: string) => void;
  resetAlerts: () => void;
}

const defaultAlerts: Alert[] = [
  {
    id: 'temperature',
    title: 'Low Temperature Warning',
    description: 'Temperature has dropped below 15°C in the living room',
    icon: 'thermometer',
    severity: 'warning',
    onPress: () => {},
  },
  {
    id: 'gas',
    title: 'High Gas Level Detected',
    description: 'Gas level is above normal threshold in the kitchen',
    icon: 'warning',
    severity: 'danger',
    onPress: () => {},
  },
  {
    id: 'movement',
    title: 'Movement Detected',
    description: 'Unusual movement detected in the backyard',
    icon: 'walk',
    severity: 'info',
    onPress: () => {},
  },
  {
    id: 'alarm',
    title: 'Alarm System Triggered',
    description: 'Security alarm was triggered in the garage',
    icon: 'shield',
    severity: 'danger',
    onPress: () => {},
  },
];

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);

  const deleteAlert = (id: string) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  };

  const resetAlerts = () => {
    setAlerts(defaultAlerts);
  };

  return (
    <AlertsContext.Provider value={{ alerts, deleteAlert, resetAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
} 