const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "test-client-" + Math.random().toString(16).substr(2, 8),
  clean: true
});

client.on("connect", () => {
  const topic = "ev/sensor/sıcaklık";
  const payload = JSON.stringify({ deger: 23.5 });

  client.publish(topic, payload, () => {
    console.log("✅ MQTT test verisi gönderildi.");
    client.end();
  });
});

client.on("error", (err) => {
  console.error("❌ MQTT bağlantı hatası:", err.message);
});
