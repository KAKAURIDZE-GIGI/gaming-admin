// Server-authoritative game outcomes. The client never decides winnings —
// it only renders what these handlers return. Every play mutates the player's
// balance and writes a PlayHistory row.
const Wheel = require("../models/Wheel");
const Raffle = require("../models/Raffle");
const Leaderboard = require("../models/Leaderboard");
const PlayHistory = require("../models/PlayHistory");
const RaffleTicket = require("../models/RaffleTicket");
const LeaderboardEntry = require("../models/LeaderboardEntry");

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

// POST /api/play/wheel/:id   { bet }
async function playWheel(req, res) {
  const user = req.user;
  const bet = Number(req.body.bet);
  const wheel = await Wheel.findById(req.params.id).catch(() => null);
  if (!wheel || wheel.status !== "active") {
    return err(res, 404, "Wheel not available");
  }

  const bets = allowedBets(wheel, wheel.spinCost);
  if (!bets.includes(bet)) return err(res, 400, "Invalid bet size");
  if (user.balance < bet) return err(res, 400, "Insufficient balance");

  if (wheel.maxSpinsPerUser) {
    const spins = await PlayHistory.countDocuments({
      userId: user.id,
      gameId: wheel.id,
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

  user.balance += net;
  await user.save();
  await PlayHistory.create({
    userId: user.id,
    gameType: "wheel",
    gameId: wheel.id,
    gameName: wheel.name,
    bet,
    outcome: segment.label,
    amountWon: net,
    balanceAfter: user.balance,
  });

  res.json({
    segmentIndex: index,
    segment,
    payout,
    amountWon: net,
    balance: user.balance,
  });
}

// POST /api/play/raffle/:id   { bet, quantity }
async function playRaffle(req, res) {
  const user = req.user;
  const bet = Number(req.body.bet);
  const quantity = Math.max(1, Math.floor(Number(req.body.quantity) || 1));
  const raffle = await Raffle.findById(req.params.id).catch(() => null);
  if (!raffle || raffle.status !== "active") {
    return err(res, 404, "Raffle not available");
  }

  const bets = allowedBets(raffle, raffle.ticketPrice);
  if (!bets.includes(bet)) return err(res, 400, "Invalid bet size");

  const cost = bet * quantity;
  if (user.balance < cost) return err(res, 400, "Insufficient balance");

  // Enforce per-user and global ticket limits.
  const mine = await RaffleTicket.aggregate([
    { $match: { userId: user._id, raffleId: raffle._id } },
    { $group: { _id: null, qty: { $sum: "$quantity" } } },
  ]);
  const myQty = mine[0]?.qty || 0;
  if (raffle.maxTicketsPerUser && myQty + quantity > raffle.maxTicketsPerUser) {
    return err(res, 403, `Max ${raffle.maxTicketsPerUser} tickets per user`);
  }
  if (raffle.totalTicketLimit) {
    const all = await RaffleTicket.aggregate([
      { $match: { raffleId: raffle._id } },
      { $group: { _id: null, qty: { $sum: "$quantity" } } },
    ]);
    if ((all[0]?.qty || 0) + quantity > raffle.totalTicketLimit) {
      return err(res, 403, "Raffle is sold out");
    }
  }

  user.balance -= cost;
  await user.save();
  await RaffleTicket.create({
    userId: user.id,
    raffleId: raffle.id,
    quantity,
    bet,
  });
  await PlayHistory.create({
    userId: user.id,
    gameType: "raffle",
    gameId: raffle.id,
    gameName: raffle.name,
    bet,
    outcome: `${quantity} ticket${quantity > 1 ? "s" : ""}`,
    amountWon: -cost,
    balanceAfter: user.balance,
  });

  res.json({
    tickets: quantity,
    totalTickets: myQty + quantity,
    cost,
    balance: user.balance,
  });
}

// POST /api/play/leaderboard/:id   { bet }
async function playLeaderboard(req, res) {
  const user = req.user;
  const bet = Number(req.body.bet);
  const board = await Leaderboard.findById(req.params.id).catch(() => null);
  if (!board || board.status !== "active") {
    return err(res, 404, "Leaderboard not available");
  }

  const bets = allowedBets(board, 10);
  if (!bets.includes(bet)) return err(res, 400, "Invalid bet size");
  if (user.balance < bet) return err(res, 400, "Insufficient balance");

  // Server RNG: points earned scale with the stake; a chance to win cash too.
  const points = Math.floor(bet * (0.5 + Math.random() * 2.5));
  const cashWon =
    Math.random() < 0.4 ? Math.floor(bet * (1 + Math.random() * 2)) : 0;
  const net = cashWon - bet;

  user.balance += net;
  await user.save();

  const entry = await LeaderboardEntry.findOneAndUpdate(
    { userId: user._id, leaderboardId: board._id },
    { $inc: { score: points }, $setOnInsert: { name: user.name } },
    { new: true, upsert: true },
  );
  const rank =
    (await LeaderboardEntry.countDocuments({
      leaderboardId: board._id,
      score: { $gt: entry.score },
    })) + 1;

  await PlayHistory.create({
    userId: user.id,
    gameType: "leaderboard",
    gameId: board.id,
    gameName: board.title,
    bet,
    outcome: `+${points} pts`,
    amountWon: net,
    balanceAfter: user.balance,
  });

  res.json({
    points,
    totalScore: entry.score,
    rank,
    cashWon,
    amountWon: net,
    balance: user.balance,
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

// GET /api/play/leaderboard/:id/standings
async function standings(req, res) {
  const leaderboardId = req.params.id;
  const top = await LeaderboardEntry.find({ leaderboardId })
    .sort({ score: -1 })
    .limit(50);
  const me = await LeaderboardEntry.findOne({
    leaderboardId,
    userId: req.user._id,
  });
  let myRank = null;
  if (me) {
    myRank =
      (await LeaderboardEntry.countDocuments({
        leaderboardId,
        score: { $gt: me.score },
      })) + 1;
  }
  res.json({ standings: top, myRank, myScore: me?.score || 0 });
}

module.exports = {
  playWheel,
  playRaffle,
  playLeaderboard,
  history,
  standings,
};
