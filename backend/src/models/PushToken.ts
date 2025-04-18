// src/models/PushToken.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPushToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
}

const PushTokenSchema = new Schema<IPushToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  token: { type: String, required: true }
});

export default mongoose.model<IPushToken>('PushToken', PushTokenSchema);
