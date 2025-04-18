import mongoose, { Document, Schema } from 'mongoose';

export interface IDeviceLog extends Document {
  deviceId: mongoose.Types.ObjectId;
  action: string;
  triggeredBy: 'user' | 'automation';
  user?: mongoose.Types.ObjectId;
  timestamp: Date;
}

const DeviceLogSchema = new Schema<IDeviceLog>({
  deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, required: true },
  triggeredBy: { type: String, enum: ['user', 'automation'], required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { 
    type: Date, 
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // ⏳ 30 gün sonra otomatik silinir
  }
});

export default mongoose.model<IDeviceLog>('DeviceLog', DeviceLogSchema);
