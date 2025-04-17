import { Request, Response } from 'express';
import mqtt from 'mqtt';
import Device from '../models/Device';
import DeviceLog from '../models/DeviceLog'; // ✅ Log modeli

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

// 👉 MQTT üzerinden cihaza komut gönderme
export const controlDevice = async (req: Request, res: Response) => {
  const { deviceId, action } = req.body;

  if (!deviceId || !action) {
    return res.status(400).json({ message: 'deviceId ve action gereklidir.' });
  }

  const topic = `ev/device/${deviceId}`;
  const message = JSON.stringify({ action });

  try {
    mqttClient.publish(topic, message, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'MQTT mesajı gönderilemedi', error: err.message });
      }

      // ✅ LOG EKLENDİ
      await DeviceLog.create({
        deviceId,
        action,
        triggeredBy: 'user',
        user: req.user?.userId
      });

      return res.status(200).json({ message: `Cihaza komut gönderildi: ${deviceId} → ${action}` });
    });
  } catch (err) {
    res.status(500).json({ message: 'İşlem sırasında hata oluştu', error: err });
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
    res.status(500).json({ message: 'Cihaz oluşturulamadı', error: err });
  }
};

// 👉 Kullanıcının cihazlarını listeleme
export const getUserDevices = async (req: Request, res: Response) => {
  const owner = req.user?.userId;

  try {
    const devices = await Device.find({ owner });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Cihazlar alınamadı', error: err });
  }
};
