const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const playHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    gameType: {
      type: String,
      enum: ["wheel", "raffle", "leaderboard"],
      required: true,
    },
    gameId: { type: mongoose.Schema.Types.ObjectId, required: true },
    gameName: String,
    bet: { type: Number, required: true },
    // Human-readable outcome (segment label, "N tickets", score earned, ...).
    outcome: String,
    // Net change to balance for this play (winnings minus stake). Can be negative.
    amountWon: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("PlayHistory", playHistorySchema);
