import mongoose from 'mongoose';
import Device from '../src/models/Device';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-home';

const devices = [
  {
    _id: 'light-living-room',
    name: 'Oturma Odası Işığı',
    type: 'light',
    status: 'off',
    value: 0
  },
  {
    _id: 'light-kitchen',
    name: 'Mutfak Işığı',
    type: 'light',
    status: 'off',
    value: 0
  },
  {
    _id: 'curtain-living-room',
    name: 'Oturma Odası Perdesi',
    type: 'curtain',
    status: 'off',
    value: 0
  },
  {
    _id: 'fan-living-room',
    name: 'Oturma Odası Fanı',
    type: 'fan',
    status: 'off',
    value: 0
  },
  {
    _id: 'thermostat-living-room',
    name: 'Oturma Odası Termostat',
    type: 'thermostat',
    status: 'off',
    value: 20
  }
];

async function createDevices() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Get the first user from the database to set as owner
    const db = mongoose.connection;
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı! Önce bir kullanıcı oluşturun.');
    }

    // Create devices with the user as owner
    for (const device of devices) {
      try {
        await Device.create({
          ...device,
          owner: user._id
        });
        console.log(`✅ Cihaz oluşturuldu: ${device.name}`);
      } catch (err: any) {
        if (err.code === 11000) {
          console.log(`⚠️ Cihaz zaten mevcut: ${device.name}`);
        } else {
          console.error(`❌ Cihaz oluşturma hatası (${device.name}):`, err.message);
        }
      }
    }

    console.log('✨ Tüm cihazlar oluşturuldu');
  } catch (err) {
    console.error('❌ Hata:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createDevices();
