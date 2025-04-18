// src/utils/pushNotification.ts
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Tek bir SDK örneği oluştur
const expo = new Expo();

// Tek bir push bildirimi gönderme
export const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string
) => {
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`❌ Geçersiz Expo push token: ${expoPushToken}`);
    return;
  }

  const message: ExpoPushMessage = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { withSome: 'data' },
  };

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync([message]);
    console.log('📬 Push bildirimi gönderildi:', ticketChunk);
  } catch (error) {
    console.error('❌ Push bildirimi gönderilemedi:', error);
  }
};
