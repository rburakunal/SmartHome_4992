import React, { createContext, useContext, useState } from 'react';

interface DeviceState {
  mainDoorLock: boolean;
  garageDoor: boolean;
  curtain: boolean;
  kitchenFan: boolean;
  alarmSystem: boolean;
}

interface DeviceContextType {
  deviceState: DeviceState;
  updateDeviceState: (key: keyof DeviceState, value: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    mainDoorLock: true,
    garageDoor: true,
    curtain: false,
    kitchenFan: false,
    alarmSystem: true,
  });

  const updateDeviceState = (key: keyof DeviceState, value: boolean) => {
    setDeviceState(prev => ({
      ...prev,
      [key]: value
    }));
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