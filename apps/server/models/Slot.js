const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const slotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
    },
    // Probability (0-100) that a spin is a winning spin. Admin-controlled.
    winRate: { type: Number, default: 30, min: 0, max: 100 },
    betSizes: { type: [Number], default: [] },
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("Slot", slotSchema);
