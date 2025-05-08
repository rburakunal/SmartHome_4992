import dotenv from "dotenv";
import mqtt from "mqtt";
import Alert from "../models/Alert";
import Device from "../models/Device";
import DeviceLog from "../models/DeviceLog";
import Door from "../models/Door";
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

    // 👉 Kapı sensör verisi (örnek: ev/door/{doorId})
    if (topic.includes("door")) {
      const doorId = topicParts[2];
      if (doorId) {
        try {
          const door = await Door.findById(doorId);
          if (door) {
            // Update door status
            door.status = parsed.status;
            await door.save();
            
            // Emit to dashboard
            global.io.emit("door-status-update", {
              doorId,
              status: parsed.status
            });
            
            console.log(`[MQTT] Kapı durumu güncellendi → ${door.name}: ${parsed.status}`);
          }
        } catch (err: any) {
          console.error("[MQTT] Kapı güncelleme hatası:", err.message);
        }
      }
    }

    // 👉 Cihaz sensör verisi (örnek: ev/device/{deviceId})
    if (topic.includes("device")) {
      const deviceId = topicParts[2];
      if (deviceId) {
        try {
          const device = await Device.findById(deviceId);
          if (device) {
            // Update device status
            let status = parsed.action;
            if (parsed.action === 'set-intensity' && parsed.value != null) {
              status = `intensity:${parsed.value}`;
            }
            
            device.status = status;
            await device.save();

            // Log device update
            await DeviceLog.create({
              deviceId,
              action: status,
              triggeredBy: 'sensor'
            });
            
            // Emit to dashboard
            global.io.emit("device-status-update", {
              deviceId,
              status,
              type: device.type
            });
            
            console.log(`[MQTT] Cihaz durumu güncellendi → ${device.name}: ${status}`);
          }
        } catch (err: any) {
          console.error("[MQTT] Cihaz güncelleme hatası:", err.message);
        }
      }
    }

    // 👉 Sensör verisi (örnek: ev/sensor/sicaklik)
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

            global.io.emit("cihaz-durum-guncelleme", {
              deviceId: fanDevice._id,
              action: "on"
            });
          }
        } catch (err: any) {
          console.error("[OTOMASYON] FAN açma hatası:", err.message);
        }
      }

      // ✅ Nem verisi loglama
      if (type === "nem") {
        console.log(`[MQTT] Nem verisi alındı →`, parsed);
        // SensorData kaydı zaten yukarıda yapılıyor
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

    // 👉 Cihaz komutu (örnek: /cihaz/kontrol üzerinden publish edilen mesajlar)
    if (topic.includes("device")) {
      const deviceId = topicParts[2];
      const action = parsed?.action;
      const value = parsed?.value;

      if (deviceId && action) {
        let status = action;
        if (action === "set-intensity" && value !== undefined) {
          status = `intensity:${value}`;
        }

        await Device.findByIdAndUpdate(deviceId, { status });
        console.log(`[MQTT] Cihaz durumu güncellendi → ${deviceId}: ${status}`);

        global.io.emit("cihaz-durum-guncelleme", {
          deviceId,
          action,
          value
        });
      }
    }

    // 👉 Alarm kontrol topic’i (manuel kontrol)
    if (topic === "ev/alarm/kontrol") {
      console.log(`[MQTT] Alarm kontrol komutu alındı →`, parsed);
      // Burada DB güncellemesi yapılacaksa eklenebilir
    }

    // 👉 Ana kapı kontrolü (unlock komutu)
    if (topic.startsWith("ev/door/")) {
      console.log(`[MQTT] Kapı kontrol mesajı → ${topic}:`, parsed);
    }

  } catch (err: any) {
    console.error("[MQTT] Veri işleme hatası:", err.message);
  }
});

// client.on("error", (err) => {
//   console.error("❌ MQTT bağlantı hatası:", err.message);
// });
