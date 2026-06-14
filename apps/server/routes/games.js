// Read-only game configs for players (active only). Admin CRUD stays on the
// /api/{wheels,raffles,leaderboards} routes guarded by admin `protect`.
const express = require("express");
const { protectUser } = require("../middleware/userAuth");
const Wheel = require("../models/Wheel");
const Raffle = require("../models/Raffle");
const Leaderboard = require("../models/Leaderboard");

function activeRoutes(Model, label) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const data = await Model.find({ status: "active" }).sort({ createdAt: -1 });
    res.json({ data });
  });

  router.get("/:id", async (req, res) => {
    const item = await Model.findOne({
      _id: req.params.id,
      status: "active",
    }).catch(() => null);
    if (!item) return res.status(404).json({ message: `${label} not found` });
    res.json(item);
  });

  return router;
}

const router = express.Router();
router.use(protectUser);
router.use("/wheels", activeRoutes(Wheel, "Wheel"));
router.use("/raffles", activeRoutes(Raffle, "Raffle"));
router.use("/leaderboards", activeRoutes(Leaderboard, "Leaderboard"));

module.exports = router;
