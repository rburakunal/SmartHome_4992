import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("✅ MQTT yayınına bağlandı.");

  const topic = "ev/sensor/sicaklik";
  const message = JSON.stringify({ deger: 23.4 });

  client.publish(topic, message, () => {
    console.log(`📤 Yayın yapıldı → ${topic}: ${message}`);
    client.end(); // Bağlantıyı kapat
  });
});
