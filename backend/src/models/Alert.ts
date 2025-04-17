import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  type: string;
  topic: string;
  message: string;
  timestamp: Date;
}

const AlertSchema = new Schema<IAlert>({
  type: { type: String, required: true },     // Örn: gaz, duman, ses
  topic: { type: String, required: true },    // MQTT topic
  message: { type: String, required: true },  // Açıklama
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAlert>('Alert', AlertSchema);
