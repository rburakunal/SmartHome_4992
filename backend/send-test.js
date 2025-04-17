const mqtt = require("mqtt");

// MQTT broker'a bağlan
const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "test-client-" + Math.random().toString(16).substr(2, 8),
  clean: true // Otomatik temiz bağlantı
});

// Bağlantı kurulunca çalışacak
client.on("connect", () => {
  const topic = "ev/sensor/gaz";              // Alarm tetikleyen topic
  const payload = JSON.stringify({ deger: 1 }); // 1 = tehlike

  client.publish(topic, payload, () => {
    console.log(`📤 Yayın yapıldı → ${topic}: ${payload}`);
    console.log("🚨 Gaz alarmı test verisi gönderildi.");
    client.end(); // Bağlantı kapatılır
  });
});

// Bağlantı hatası olursa
client.on("error", (err) => {
  console.error("❌ MQTT bağlantı hatası:", err.message);
});
