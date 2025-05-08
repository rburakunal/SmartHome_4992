import { Request, Response } from 'express';
import mqtt from 'mqtt';
import Device from '../models/Device';
import DeviceLog from '../models/DeviceLog';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

// 👉 Cihaz kontrolü: on/off, intensity, curtain, exhaust vs.
export const controlDevice = async (req: Request, res: Response) => {
  const { deviceId, action, value } = req.body;

  if (!deviceId || !action) {
    return res.status(400).json({ message: 'deviceId ve action gereklidir.' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Cihaz bulunamadı.' });
    }

    // ➕ Payload oluşturma
    const payload: any = { action };
    
    // Eğer sayısal değer varsa ekle
    if (value != null) {
      payload.value = Number(value);
    }

    const topic = `ev/device/${deviceId}`;
    mqttClient.publish(topic, JSON.stringify(payload), async (err) => {
      if (err) {
        return res.status(500).json({ message: 'MQTT mesajı gönderilemedi', error: err.message });
      }

      // ➕ Cihaz status ve değer güncellemesi
      device.status = action;
      if (value != null) {
        device.value = Number(value);
      }
      await device.save();

      // ✅ Log kaydı
      await DeviceLog.create({
        deviceId,
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

      return res.status(200).json({
        message: `Cihaz güncellendi: ${device.name} → ${action}${value ? ` (${value})` : ''}`,
        device,
        topic,
        payload
      });
    });
  } catch (err) {
    console.error("❌ Cihaz kontrol hatası:", err);
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
    console.error("❌ Cihaz oluşturulamadı:", err);
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
    console.error("❌ Cihazlar alınamadı:", err);
    res.status(500).json({ message: 'Cihazlar alınamadı', error: err });
  }
};
