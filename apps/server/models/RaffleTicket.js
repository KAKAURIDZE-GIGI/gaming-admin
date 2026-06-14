const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const raffleTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    raffleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Raffle",
      index: true,
    },
    quantity: { type: Number, required: true },
    bet: { type: Number, required: true },
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("RaffleTicket", raffleTicketSchema);
