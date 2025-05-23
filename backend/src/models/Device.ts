// src/models/Device.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  name: string;
  type: string;
  status: string;
  value?: number;
  owner: mongoose.Types.ObjectId;
}

const DeviceSchema = new Schema<IDevice>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'off' },
  value: { type: Number, default: null },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Device = mongoose.model<IDevice>('Device', DeviceSchema);

export default Device;
