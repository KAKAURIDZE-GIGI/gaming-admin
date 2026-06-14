const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const leaderboardEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    leaderboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leaderboard",
      index: true,
    },
    name: String,
    score: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON },
);

// One entry per user per leaderboard.
leaderboardEntrySchema.index({ userId: 1, leaderboardId: 1 }, { unique: true });

module.exports = mongoose.model("LeaderboardEntry", leaderboardEntrySchema);
