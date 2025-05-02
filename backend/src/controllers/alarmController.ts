import { Request, Response } from 'express';
import mqtt from 'mqtt';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://localhost:1883");

export const controlAlarm = async (req: Request, res: Response) => {
  const { action } = req.body;
  if (!["on", "off"].includes(action)) {
    return res.status(400).json({ error: "Geçersiz alarm komutu" });
  }

  const topic = "ev/alarm/kontrol";
  const payload = JSON.stringify({ action });
  mqttClient.publish(topic, payload);

  res.json({ success: true, topic, payload });
};
