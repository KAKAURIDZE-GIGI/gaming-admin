const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const prizeSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    imageUrl: String,
  },
  { _id: true, toJSON },
);

const leaderboardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startDate: String,
    endDate: String,
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    scoringType: { type: String, enum: ["points", "wins", "wagered"] },
    betSizes: { type: [Number], default: [] },
    prizes: [prizeSchema],
    maxParticipants: Number,
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
