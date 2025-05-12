import { Request, Response } from 'express';
import mqtt from 'mqtt';
import Device from '../models/Device';
import DeviceLog from '../models/DeviceLog';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

// 👉 Cihaz kontrolü: on/off, intensity, curtain, exhaust vs.
export const controlDevice = async (req: Request, res: Response) => {
  const { deviceId, action, value } = req.body;

  console.log('💬 Gelen istek:', { deviceId, action, value });

  if (!deviceId || !action) {
    console.error('❌ Eksik parametreler:', { deviceId, action });
    return res.status(400).json({ message: 'deviceId ve action gereklidir.' });
  }

  try {
    // 🔍 Mevcut cihaz durumunu kontrol et
    const device = await Device.findById(deviceId);
    if (!device) {
      console.error('❌ Cihaz bulunamadı:', deviceId);
      return res.status(404).json({ message: `Cihaz bulunamadı: ${deviceId}` });
    }

    console.log('💾 Mevcut cihaz durumu:', {
      id: device._id,
      status: device.status,
      value: device.value
    });

    // ➡ Cihaz status ve değer güncellemesi
    if (action === 'set-intensity') {
      device.status = `intensity:${value}`;
      device.value = Number(value);
    } else {
      device.status = action;
      device.value = Number(value);
    }

    console.log('💾 Cihaz güncelleniyor:', {
      id: device._id,
      newStatus: device.status,
      newValue: device.value
    });

    await device.save();

    // ➡ MQTT mesajı gönder
    const mqttPayload = { action, value: device.value };
    const mqttTopic = `ev/device/${deviceId}`;
    
    mqttClient.publish(mqttTopic, JSON.stringify(mqttPayload));

    // ✅ Log kaydı
    await DeviceLog.create({
      deviceId: device._id, // MongoDB ObjectId olarak gönder
      action,
      value: device.value,
      triggeredBy: 'user',
      user: req.user?.userId
    });

    // ✅ Sensöre güncelleme gönder
    const sensorTopic = `ev/sensor/${deviceId}/control`;
    mqttClient.publish(sensorTopic, JSON.stringify({
      action,
      value: device.value
    }));

    // Başarılı yanıt dön
    return res.status(200).json({
      message: 'Cihaz güncellendi',
      device: {
        id: device._id,
        name: device.name,
        status: device.status,
        value: device.value
      }
    });
  } catch (err) {
    console.error('❌ Cihaz kontrol hatası:', err);
    return res.status(500).json({ 
      message: 'İşlem sırasında hata oluştu', 
      error: err instanceof Error ? err.message : 'Bilinmeyen hata'
    });
  }
};

// 👉 Yeni cihaz oluşturma
export const createDevice = async (req: Request, res: Response) => {
  const { name, type } = req.body;
  const owner = req.user?.userId;

  try {
    const newDevice = new Device({ name, type, owner });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    console.error('❌ Cihaz oluşturulamadı:', err);
    res.status(500).json({ message: 'Cihaz oluşturulamadı', error: err });
  }
};

// 👉 Kullanıcının cihazlarını listeleme
export const getUserDevices = async (req: Request, res: Response) => {
  try {
    // Get all devices without owner filtering for now
    const devices = await Device.find();
    console.log('💾 Bulunan cihazlar:', devices);
    res.json(devices);
  } catch (err) {
    console.error('❌ Cihazlar alınamadı:', err);
    res.status(500).json({ message: 'Cihazlar alınamadı', error: err });
  }
};
