import dotenv from "dotenv";
import mqtt from "mqtt";
import Alert from "../models/Alert";
import Device from "../models/Device";
import DeviceLog from "../models/DeviceLog";
import SensorData from "../models/SensorData";

// ✅ global.io için tip tanımı (Socket.IO global tanımı)
import type { Server as SocketIOServer } from 'socket.io';
declare global {
  var io: SocketIOServer;
}

dotenv.config();

console.log("📡 mqttService başlatıldı");

const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log(`[MQTT] Bağlantı başarılı → ${brokerUrl}`);
  client.subscribe("ev/#", (err) => {
    if (err) {
      console.error("[MQTT] Abonelik hatası:", err.message);
    } else {
      console.log("[MQTT] Tüm 'ev/' konularına abone olundu.");
    }
  });
});

client.on("message", async (topic, message) => {
  try {
    const parsed = JSON.parse(message.toString());
    const topicParts = topic.split("/");

    // 👉 Sensör verisi
    if (topic.includes("sensor")) {
      const type = topicParts[2] || "unknown";
      const data = { topic, type, value: parsed };
      await SensorData.create(data);
      console.log(`[MQTT] Sensör verisi kaydedildi → ${type}:`, parsed);

      // ✅ FAN Otomasyonu (sicaklik > 30)
      if (type === "sicaklik" && parsed?.deger > 30) {
        try {
          const fanDevice = await Device.findOne({ name: /fan/i });
          if (fanDevice) {
            const controlTopic = `ev/device/${fanDevice._id}`;
            const payload = JSON.stringify({ action: "on" });

            client.publish(controlTopic, payload, () => {
              console.log(`[OTOMASYON] FAN açıldı → Sıcaklık: ${parsed.deger}°C`);
            });

            await Device.findByIdAndUpdate(fanDevice._id, { status: "on" });

            await DeviceLog.create({
              deviceId: fanDevice._id,
              action: "on",
              triggeredBy: "automation"
            });

            // 🔔 Emit cihaz durumu (otomasyon)
            global.io.emit("cihaz-durum-guncelleme", {
              deviceId: fanDevice._id,
              action: "on"
            });
          }
        } catch (err: any) {
          console.error("[OTOMASYON] FAN açma hatası:", err.message);
        }
      }

      // ✅ Gaz alarmı
      if (type === "gaz" && parsed?.deger === 1) {
        await Alert.create({
          type: "gaz",
          topic,
          message: "🚨 Gaz sızıntısı tespit edildi! Alarm tetiklendi."
        });
        console.log("🚨 Gaz alarmı oluşturuldu!");
      }

      // ✅ Duman alarmı
      if (type === "duman" && parsed?.deger === 1) {
        await Alert.create({
          type: "duman",
          topic,
          message: "🚨 Duman algılandı! Alarm tetiklendi."
        });
        console.log("🚨 Duman alarmı oluşturuldu!");
      }
    }

    // 👉 Cihaz komutu (örneğin: /cihaz/kontrol üzerinden)
    if (topic.includes("device")) {
      const deviceId = topicParts[2];
      const action = parsed?.action;

      if (deviceId && action) {
        await Device.findByIdAndUpdate(deviceId, { status: action });
        console.log(`[MQTT] Cihaz durumu güncellendi → ${deviceId}: ${action}`);

        // 🔔 Emit cihaz durumu (manuel kontrol)
        global.io.emit("cihaz-durum-guncelleme", {
          deviceId,
          action
        });
      }
    }
  } catch (err: any) {
    console.error("[MQTT] Veri işleme hatası:", err.message);
  }
});

// client.on("error", (err) => {
//   console.error("❌ MQTT bağlantı hatası:", err.message);
// });
