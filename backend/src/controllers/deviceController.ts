import { Request, Response } from 'express';
import mqtt from 'mqtt';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

export const controlDevice = async (req: Request, res: Response) => {
  const { deviceId, action } = req.body;

  if (!deviceId || !action) {
    return res.status(400).json({ message: 'deviceId ve action gereklidir.' });
  }

  const topic = `ev/device/${deviceId}`;
  const message = JSON.stringify({ action });

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      return res.status(500).json({ message: 'MQTT mesajı gönderilemedi', error: err.message });
    }
    return res.status(200).json({ message: `Cihaza komut gönderildi: ${deviceId} → ${action}` });
  });
};
