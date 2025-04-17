import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import './services/mqttService';

import SensorData from './models/SensorData';
import alertRoutes from './routes/alertRoutes';
import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import userRoutes from './routes/userRoutes';
import veriRoutes from './routes/veriRoutes';


dotenv.config();

const app = express();
app.use(express.json());

// ROUTE Tanımları
app.use('/auth', authRoutes);
console.log("🔐 /auth route'u yüklendi");

app.use('/alertlar', alertRoutes);
console.log("🚨 /alertlar route'u yüklendi");


app.use('/cihaz', deviceRoutes);
console.log("🔌 /cihaz route'u yüklendi");

app.use('/veri', veriRoutes);
console.log("🔁 /veri route'u yüklendi");

app.use('/kullanicilar', userRoutes);
console.log("👥 /kullanicilar route'u yüklendi");

// Ana test endpoint
app.get('/', (_req, res) => {
  res.send('Smart Home Backend çalışıyor 🚀');
});

// Süper test endpoint (direkt kontrol için)
app.get('/test-direct', (_req, res) => {
  res.send('✅ Direkt test route çalıştı!');
});

// Opsiyonel veri listesi endpoint
app.get('/veri', async (_req, res) => {
  try {
    const veriler = await SensorData.find().sort({ timestamp: -1 }).limit(20);
    res.json(veriler);
  } catch (err) {
    console.error("❌ Veri çekme hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
});
app.get('/test-direct', (_req, res) => {
  res.send('✅ Direkt test route çalıştı!');
});


// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
