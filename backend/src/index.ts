import dotenv from 'dotenv';
import express from 'express';
import listEndpoints from 'express-list-endpoints'; // ✅ 5. ADIM
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import './services/mqttService';

import SensorData from './models/SensorData';
import alertRoutes from './routes/alertRoutes';
import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import veriRoutes from './routes/veriRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  }
});

app.use(express.json());

// 🌐 Socket.IO global tanım
global.io = io;

io.on('connection', (socket) => {
  console.log(`🧠 Yeni bir istemci bağlandı: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 İstemci ayrıldı: ${socket.id}`);
  });
});

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

app.use('/bildirim', notificationRoutes);
console.log("📲 /bildirim route'u yüklendi");

app.get('/', (_req, res) => {
  res.send('Smart Home Backend çalışıyor 🚀');
});

app.get('/test-direct', (_req, res) => {
  res.send('✅ Direkt test route çalıştı!');
});

app.get('/veri', async (_req, res) => {
  try {
    const veriler = await SensorData.find().sort({ timestamp: -1 }).limit(20);
    res.json(veriler);
  } catch (err) {
    console.error("❌ Veri çekme hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
});

mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// ✅ 5. ADIM — Tüm endpoint'leri göster
console.log("📋 Route listesi:", listEndpoints(app));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor (Socket.IO aktif)`);
});
