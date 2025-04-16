import dotenv from "dotenv";
import mqtt from "mqtt";
import SensorData from "../models/SensorData";

console.log("📡 mqttService başlatıldı");

dotenv.config();

const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log(`[MQTT] Bağlantı başarılı → ${brokerUrl}`);
  client.subscribe("ev/sensor/#", (err) => {
    if (err) {
      console.error("[MQTT] Abonelik hatası:", err.message);
    } else {
      console.log("[MQTT] Sensör konularına abone olundu.");
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const parsedValue = JSON.parse(message.toString());

    // Örn: topic = "ev/sensor/temperature"
    const topicParts = topic.split("/");
    const type = topicParts.length >= 3 ? topicParts[2] : "unknown";

    const data = {
      topic,
      type,
      value: parsedValue,
    };

    await SensorData.create(data);
    console.log(`[MQTT] Veri kaydedildi → ${type}:`, parsedValue);

  } catch (err: any) {
    console.error("[MQTT] Veri işleme hatası:", err.message);
  }
});

client.on("error", (err) => {
  console.error("❌ MQTT bağlantı hatası:", err.message);
});
