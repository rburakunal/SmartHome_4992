import { Request, Response } from 'express';
import mqtt from 'mqtt';
import User from '../models/User';
import Door from '../models/Door';
import bcrypt from 'bcryptjs';

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://localhost:1883");

// Get all doors for a user
export const getUserDoors = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const doors = await Door.find({ owner: userId });
    res.json(doors);
  } catch (err) {
    console.error("❌ Get doors error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new door
export const createDoor = async (req: Request, res: Response) => {
  const { name, type } = req.body;
  const owner = req.user?.userId;

  try {
    const newDoor = new Door({ 
      name, 
      type, 
      owner,
      status: "off"
    });
    await newDoor.save();
    res.status(201).json(newDoor);
  } catch (err) {
    console.error("❌ Door creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update door status
export const updateDoorStatus = async (req: Request, res: Response) => {
  const { doorId } = req.params;
  const { status } = req.body;
  const userId = req.user?.userId;

  try {
    const door = await Door.findOne({ _id: doorId, owner: userId });
    if (!door) {
      return res.status(404).json({ error: "Door not found" });
    }

    const topic = `ev/door/${doorId}`;
    const payload = JSON.stringify({ status });

    mqttClient.publish(topic, payload, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to send MQTT message" });
      }

      door.status = status;
      await door.save();

      res.json({ 
        success: true, 
        message: `Door status updated: ${door.name} → ${status}`,
        door 
      });
    });
  } catch (err) {
    console.error("❌ Door status update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

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
