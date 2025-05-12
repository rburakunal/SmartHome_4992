import mongoose from 'mongoose';
import Device from '../src/models/Device';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-home';

const DEFAULT_OWNER_ID = '645a738ebf4caa7a5c6d67f8';

const devices = [
  // Switch cihazları
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'mainDoorLock',
    type: 'switch',
    status: 'off',
    value: 0,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'garageDoor',
    type: 'switch',
    status: 'off',
    value: 0,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'alarmSystem',
    type: 'switch',
    status: 'off',
    value: 0,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'curtain',
    type: 'switch',
    status: 'off',
    value: 0,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'kitchenFan',
    type: 'switch',
    status: 'off',
    value: 0,
    owner: DEFAULT_OWNER_ID
  },
  // Slider cihazları
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'temperature',
    type: 'intensity',
    status: 'intensity:22',
    value: 22,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'humidity',
    type: 'intensity',
    status: 'intensity:45',
    value: 45,
    owner: DEFAULT_OWNER_ID
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'light',
    type: 'intensity',
    status: 'intensity:50',
    value: 50,
    owner: DEFAULT_OWNER_ID
  }
];

async function createDevices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    // Önce tüm cihazları sil
    await Device.deleteMany({});
    console.log('🗑️ Tüm cihazlar silindi');

    // Yeni cihazları oluştur
    for (const deviceData of devices) {
      try {
        await Device.create(deviceData);
        console.log(`➕ Oluşturuldu: ${deviceData.name} (owner: ${deviceData.owner})`);
      } catch (err) {
        console.error(`❌ Hata - ${deviceData.name}:`, err);
      }
    }

    // Tüm cihazları kontrol et
    const allDevices = await Device.find({});
    console.log('💾 Mevcut cihazlar:', allDevices.map(d => ({
      id: d._id,
      name: d.name,
      owner: d.owner,
      status: d.status,
      value: d.value
    })));

    console.log('✅ Tüm cihazlar başarıyla oluşturuldu');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

createDevices();
