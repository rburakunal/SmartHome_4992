import { Request, Response } from 'express';
import mqtt from 'mqtt';
import User from '../models/User';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://localhost:1883");

export const unlockDoor = async (req: Request, res: Response) => {
  const { pin } = req.body;
  const userId = req.user?.userId;

  try {
    const user = await User.findById(userId);
    if (!user || user.pin !== pin) {
      return res.status(403).json({ error: "PIN yanlış" });
    }

    const topic = `ev/door/${userId}`;
    const payload = JSON.stringify({ action: "unlock" });

    mqttClient.publish(topic, payload);
    res.json({ success: true, topic, payload });

  } catch (err) {
    console.error("❌ Kapı açma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
