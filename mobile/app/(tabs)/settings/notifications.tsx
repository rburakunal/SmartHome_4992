import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';

interface NotificationSetting {
  id: string;
  title: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'gas', title: 'Gas Level Alerts', enabled: true },
    { id: 'movement', title: 'Movement Detection', enabled: true },
    { id: 'temperature', title: 'Temperature Alerts', enabled: true },
    { id: 'alarm', title: 'Alarm System', enabled: true },
  ]);

  const toggleNotification = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification Settings</Text>
      {settings.map(setting => (
        <View key={setting.id} style={styles.settingRow}>
          <Text style={styles.settingText}>{setting.title}</Text>
          <Switch
            value={setting.enabled}
            onValueChange={() => toggleNotification(setting.id)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={setting.enabled ? '#1e88e5' : '#f4f3f4'}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
}); 