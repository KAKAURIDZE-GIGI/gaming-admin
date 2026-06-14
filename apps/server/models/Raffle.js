const mongoose = require("mongoose");
const { toJSON } = require("./_transform");

const prizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: String,
  },
  { _id: true, toJSON },
);

const raffleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    startDate: String,
    endDate: String,
    drawDate: String,
    status: {
      type: String,
      enum: ["draft", "active", "drawn"],
      default: "draft",
    },
    ticketPrice: Number,
    maxTicketsPerUser: Number,
    prizes: [prizeSchema],
    totalTicketLimit: { type: Number, default: null },
  },
  { timestamps: true, toJSON },
);

module.exports = mongoose.model("Raffle", raffleSchema);
