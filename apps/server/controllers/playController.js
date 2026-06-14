// Server-authoritative game outcomes. The client never decides winnings —
// it only renders what these handlers return. Every play mutates the player's
// balance and writes a PlayHistory row.
const Wheel = require("../models/Wheel");
const Slot = require("../models/Slot");
const User = require("../models/User");
const PlayHistory = require("../models/PlayHistory");
const slotEngine = require("../lib/slotEngine");

const MONETARY = new Set(["coins", "bonus"]); // prize types that pay cash

// Bets a game accepts: configured betSizes, else fall back to its single cost.
function allowedBets(game, fallbackCost) {
  if (Array.isArray(game.betSizes) && game.betSizes.length) return game.betSizes;
  return [fallbackCost || 10];
}

// Pick a segment index weighted by `weight`. Server-side RNG = anti-cheat.
function weightedPick(segments) {
  const total = segments.reduce((sum, s) => sum + (s.weight || 0), 0);
  let r = Math.random() * total;
  for (let i = 0; i < segments.length; i++) {
    r -= segments[i].weight || 0;
    if (r < 0) return i;
  }
  return segments.length - 1;
}

function err(res, status, message) {
  return res.status(status).json({ message });
}

/** Atomically apply a balance change; fails if balance would drop below the stake. */
async function applyBalanceChange(userId, minBalance, netChange) {
  return User.findOneAndUpdate(
    { _id: userId, balance: { $gte: minBalance } },
    { $inc: { balance: netChange } },
    { new: true },
  );
}

// POST /api/play/wheel/:id   { bet }
async function playWheel(req, res) {
  const user = req.user;
  const bet = Number(req.body.bet);
  const wheel = await Wheel.findById(req.params.id).catch(() => null);
  if (!wheel || wheel.status !== "active") {
    return err(res, 404, "Wheel not available");
  }

  const bets = allowedBets(wheel, wheel.spinCost);
  if (!Number.isFinite(bet) || bet <= 0 || !bets.includes(bet)) {
    return err(res, 400, "Invalid bet size");
  }

  if (wheel.maxSpinsPerUser) {
    const spins = await PlayHistory.countDocuments({
      userId: user._id,
      gameId: wheel._id,
      gameType: "wheel",
    });
    if (spins >= wheel.maxSpinsPerUser) {
      return err(res, 403, "You have reached the spin limit for this wheel");
    }
  }

  const index = weightedPick(wheel.segments);
  const segment = wheel.segments[index];
  const baseBet = Math.min(...bets);
  const payout = MONETARY.has(segment.prizeType)
    ? Math.round(segment.prizeAmount * (bet / baseBet))
    : 0;
  const net = payout - bet;

  const updatedUser = await applyBalanceChange(user._id, bet, net);
  if (!updatedUser) return err(res, 400, "Insufficient balance");

  await PlayHistory.create({
    userId: user._id,
    gameType: "wheel",
    gameId: wheel._id,
    gameName: wheel.name,
    bet,
    outcome: segment.label,
    amountWon: net,
    balanceAfter: updatedUser.balance,
  });

  res.json({
    segmentIndex: index,
    segment,
    payout,
    amountWon: net,
    balance: updatedUser.balance,
  });
}

// POST /api/play/slot/:id   { bet, lines }
async function playSlot(req, res) {
  const user = req.user;
  const bet = Number(req.body.bet);
  const lines = Number(req.body.lines);
  const slot = await Slot.findById(req.params.id).catch(() => null);
  if (!slot || slot.status !== "active") {
    return err(res, 404, "Slot not available");
  }

  const bets = allowedBets(slot, 10);
  if (!Number.isFinite(bet) || bet <= 0 || !bets.includes(bet)) {
    return err(res, 400, "Invalid bet size");
  }
  if (!slotEngine.ALLOWED_LINES.includes(lines)) {
    return err(res, 400, "Lines must be 1, 3 or 9");
  }

  const stake = bet * lines;

  const { grid, winningLines, payout } = slotEngine.spin({
    winRate: slot.winRate,
    bet,
    lines,
  });
  const net = payout - stake;

  const updatedUser = await applyBalanceChange(user._id, stake, net);
  if (!updatedUser) return err(res, 400, "Insufficient balance");

  await PlayHistory.create({
    userId: user._id,
    gameType: "slot",
    gameId: slot._id,
    gameName: slot.name,
    bet: stake,
    outcome: winningLines.length
      ? `${winningLines.length} line${winningLines.length > 1 ? "s" : ""} won`
      : "No win",
    amountWon: net,
    balanceAfter: updatedUser.balance,
  });

  res.json({
    grid,
    winningLines,
    lines,
    payout,
    amountWon: net,
    balance: updatedUser.balance,
  });
}

// GET /api/play/history?page=&limit=
async function history(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = { userId: req.user._id };
  const [data, total] = await Promise.all([
    PlayHistory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    PlayHistory.countDocuments(filter),
  ]);
  res.json({ data, total, page, limit });
}

module.exports = {
  playWheel,
  playSlot,
  history,
};
