import { Request, Response } from 'express';
import mqtt from 'mqtt';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://localhost:1883");

export const unlockDoor = async (req: Request, res: Response) => {
  const { pin } = req.body;
  const userId = req.user?.userId;

  try {
    const user = await User.findById(userId);
    if (!user || !user.pin) {
      return res.status(403).json({ error: "PIN not set" });
    }

    // Check if the stored PIN is already hashed (bcrypt hashes start with '$2')
    let isPinValid;
    if (user.pin.startsWith('$2')) {
      // PIN is hashed, use bcrypt compare
      isPinValid = await bcrypt.compare(pin, user.pin);
    } else {
      // PIN is still plain text, do direct comparison
      isPinValid = user.pin === pin;
    }

    if (!isPinValid) {
      return res.status(403).json({ error: "Incorrect PIN" });
    }

    const topic = `ev/door/${userId}`;
    const payload = JSON.stringify({ action: "unlock" });

    mqttClient.publish(topic, payload);
    res.json({ success: true, topic, payload });

  } catch (err) {
    console.error("❌ Door unlock error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
