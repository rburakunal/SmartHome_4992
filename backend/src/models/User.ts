import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  expoPushToken?: string;
  pin?: string; // ✅ Kullanıcıya özel PIN (ör: kapı açma için)
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  expoPushToken: { type: String },
  pin: { type: String } // ✅ Yeni eklenen alan
});

export default mongoose.model<IUser>('User', UserSchema);
