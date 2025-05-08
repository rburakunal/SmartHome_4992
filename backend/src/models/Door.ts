import mongoose from "mongoose";

const doorSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["main-door", "garage-door"]
  },
  status: {
    type: String,
    enum: ["on", "off"],
    default: "off"
  },
  owner: {
    type: String,
    required: true,
    ref: "User"
  },
  __v: {
    type: Number,
    default: 0
  }
}, { _id: false });

const Door = mongoose.model("Door", doorSchema);
export default Door;
