const express = require("express");
const { protectUser } = require("../middleware/userAuth");
const { playWheel, playSlot, history } = require("../controllers/playController");

const router = express.Router();

// Every play action requires a logged-in player.
router.use(protectUser);

router.post("/wheel/:id", playWheel);
router.post("/slot/:id", playSlot);
router.get("/history", history);

module.exports = router;
