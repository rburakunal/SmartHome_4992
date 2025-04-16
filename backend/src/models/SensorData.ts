import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  type: {
    type: String, // Örn: temperature, motion
    default: null,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);
export default SensorData;
