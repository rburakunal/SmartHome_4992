# 🏠 Smart Home Automation - Backend

Bu proje, bir akıllı ev otomasyon sisteminin Node.js & TypeScript tabanlı backend'ini içermektedir. Kullanıcı kimlik doğrulaması, MQTT üzerinden sensör verisi işleme, otomatik cihaz kontrolü, bildirim sistemi ve gerçek zamanlı soket yayını gibi birçok özelliği desteklemektedir.

## 🚀 Özellikler

### 🔐 Kullanıcı Yönetimi
- Kullanıcı kaydı ve girişi (JWT token)
- Admin & User rolleri
- Yetkilendirme ve korunan endpoint'ler

### 📡 MQTT Entegrasyonu
- MQTT üzerinden sensör verilerini alma
- MongoDB’ye verilerin kaydedilmesi
- MQTT ile cihaza komut gönderme (publish)
- MQTT üzerinden gelen komutlara göre cihaz durumunu güncelleme

### 🔌 Cihaz Yönetimi
- Cihaz ekleme
- Kullanıcıya ait cihazları listeleme
- Cihaza komut gönderme (`POST /cihaz/kontrol`)

### 🔁 Otomasyon Sistemi
- Sıcaklık > 30°C olduğunda otomatik olarak fan açılır
- MQTT komutu ile kontrol edilir
- Otomasyon tetiklenmeleri `DeviceLog` koleksiyonuna kaydedilir

### 🚨 Alarm & Bildirim Sistemi
- Gaz / Duman gibi tehlikeli sensör verileri geldiğinde `Alert` kaydı oluşturulur
- `GET /alertlar` ile admin panelde görüntülenebilir
- Push notification ile kullanıcıya mobil bildirim gönderilir

### 📲 Push Notification
- Kullanıcının Expo push token’ı kaydedilir
- Mobil uygulamaya bildirim gönderilir (`expo-server-sdk`)
- Endpoints:
  - `POST /bildirim/token` → Token kaydet
  - `POST /bildirim/gonder` → Bildirim gönder

### 🌐 Gerçek Zamanlı Socket.IO
- MQTT ile cihaz durumu değiştiğinde socket yayını yapılır
- Frontend tarafı bu yayını dinleyerek UI güncellemesi yapabilir

---

## 🛠 Kurulum

### 1. Depoyu klonla

```bash
git clone https://github.com/Bencuci/smart-home-app.git
cd smart-home-app/backend

2. Bağımlılıkları yükle 
npm install

3. .env dosyası oluştur
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-home
PORT=5000
MQTT_BROKER_URL=mqtt://localhost:1883
JWT_SECRET=gizliAnahtar

4. MQTT broker başlat (lokal)
node local-broker.js

5. Geliştirme sunucusunu çalıştır
npm run dev

🧪 Test Senaryoları

Test	Açıklama
/auth/register	Yeni kullanıcı kaydı
/auth/login	Giriş ve token alma
/cihaz	Cihaz ekleme ve listeleme
/cihaz/kontrol	MQTT ile komut gönderme
send-test.js	MQTT publish → gaz alarmı tetikler
/alertlar	Gaz veya duman alarmı kaydını gösterir
/bildirim/token	Expo push token kaydeder
/bildirim/gonder	Token’a mobil bildirim gönderir

🗃️ Kullanılan Teknolojiler
Node.js + Express

TypeScript

MongoDB & Mongoose

Socket.IO

MQTT.js

Expo Push Notification SDK

Aedes (lokal MQTT broker)

📁 Proje Yapısı
pgsql
Kopyala
Düzenle
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── types/
├── utils/
│
├── index.ts
└── .env

👨‍💻 Geliştiriciler
Backend: @yaser @rıdvan (Capstone Backend Developer)


✅ Durum Özeti

Özellik	Durum
Auth / JWT / Admin Panel	✅ Tamamlandı
MQTT ile veri alışverişi	✅ Tamamlandı
Sensör kaydı & otomasyon	✅ Tamamlandı
Alarm & Alert sistemi	✅ Tamamlandı
Push bildirim gönderimi	✅ Tamamlandı
Cihaz log sistemi	✅ Tamamlandı
Gerçek zamanlı yayın (Socket)	✅ Tamamlandı
Frontend UI entegrasyonu	🔜 Frontend tarafında