const express = require("express");
const { protectUser } = require("../middleware/userAuth");
const {
  playWheel,
  playRaffle,
  playLeaderboard,
  history,
  standings,
} = require("../controllers/playController");

const router = express.Router();

// Every play action requires a logged-in player.
router.use(protectUser);

router.post("/wheel/:id", playWheel);
router.post("/raffle/:id", playRaffle);
router.post("/leaderboard/:id", playLeaderboard);
router.get("/leaderboard/:id/standings", standings);
router.get("/history", history);

module.exports = router;
