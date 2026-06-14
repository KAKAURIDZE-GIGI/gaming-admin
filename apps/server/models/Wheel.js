const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const segmentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    color: { type: String, required: true },
    weight: { type: Number, required: true },
    prizeType: { type: String, required: true },
    prizeAmount: { type: Number, required: true },
    imageUrl: String,
  },
  { _id: true, toJSON },
);

const wheelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
    },
    segments: [segmentSchema],
    betSizes: { type: [Number], default: [] },
    maxSpinsPerUser: Number,
    spinCost: Number,
    backgroundColor: String,
    borderColor: String,
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("Wheel", wheelSchema);
