import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../service/api';
import { API_CONFIG } from '../service/config';

interface Device {
  _id: string;
  name: string;
  type: string;
  status: string;
  value: number;
}

interface DeviceState {
  // Switch cihazları
  mainDoorLock: boolean;
  garageDoor: boolean;
  curtain: boolean;
  kitchenFan: boolean;
  alarmSystem: boolean;

  // Slider cihazları
  temperature: number;
  humidity: number;
  light: number;
}

interface DeviceMapping {
  [key: string]: string; // key: device name, value: device ID
}

interface DeviceContextType {
  deviceState: DeviceState;
  updateDeviceState: (key: keyof DeviceState, value: boolean | number) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceMapping, setDeviceMapping] = useState<DeviceMapping>({});
  const [deviceState, setDeviceState] = useState<DeviceState>({
    // Switch cihazları
    mainDoorLock: false,
    garageDoor: false,
    curtain: false,
    kitchenFan: false,
    alarmSystem: false,

    // Slider cihazları
    temperature: 22,
    humidity: 45,
    light: 50,
  });

  // Başlangıçta mevcut durumları MongoDB'den çek
  const fetchDeviceStates = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('❌ Auth token bulunamadı');
        return;
      }

      const response = await api.get(`${API_CONFIG.ENDPOINTS.DEVICES}`);
      console.log('API response:', response.data);
      const devices = response.data;

      // Her cihaz için durumu güncelle
      const newState: DeviceState = {
        // Switch cihazları
        mainDoorLock: false,
        garageDoor: false,
        curtain: false,
        kitchenFan: false,
        alarmSystem: false,

        // Slider cihazları
        temperature: 22,
        humidity: 45,
        light: 50,
      };

      // Device ID'lerini kaydet
      const newMapping: DeviceMapping = {};

      devices.forEach((device: Device) => {
        // Device mapping'i güncelle - name'i key olarak kullan
        newMapping[device.name] = device._id;
        // Type assertion to fix index error
        const deviceName = device.name as keyof DeviceState;
        if (deviceName === 'temperature' || deviceName === 'humidity' || deviceName === 'light') {
          newState[deviceName] = device.value;
        } else {
          newState[deviceName] = device.status === 'on';
        }
      });

      console.log('Device mapping:', newMapping);
      setDeviceState(newState);
      setDeviceMapping(newMapping);
    } catch (error) {
      console.error('❌ Cihaz durumları alınamadı:', error);
    }
  };

  // Her 5 saniyede bir cihaz durumlarını güncelle
  useEffect(() => {
    fetchDeviceStates();

    const interval = setInterval(() => {
      fetchDeviceStates();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDeviceState = async (key: keyof DeviceState, value: boolean | number) => {
    try {
      // Auth token kontrolü
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('❌ Auth token bulunamadı');
        return;
      }

      // Önce local state'i güncelle (daha iyi kullanıcı deneyimi için)
      setDeviceState((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Cihazı güncelle
      let actionValue;
      let numericValue;

      // Slider kontrolleri için özel durum
      if (typeof value === 'number') {
        actionValue = 'set-intensity';
        numericValue = value;
      } else {
        actionValue = value ? 'on' : 'off';
        numericValue = value ? 1 : 0;
      }

      // Get device ID from mapping using device name
      const deviceId = deviceMapping[key];
      
      if (!deviceId) {
        throw new Error(`Device ID not found for ${key}`);
      }

      console.log('Gönderilen veri:', {
        deviceId,
        action: actionValue,
        value: numericValue
      });

      const response = await api.post(`${API_CONFIG.ENDPOINTS.DEVICES}/kontrol`, {
        deviceId,
        action: actionValue,
        value: numericValue
      });

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('❌ Cihaz güncelleme hatası:', error);
      // Hata durumunda yerel durumu eski haline geri al
      setDeviceState((prev) => ({
        ...prev,
        [key]: deviceState[key],
      }));
    }
  };

  return (
    <DeviceContext.Provider value={{ deviceState, updateDeviceState }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
} 