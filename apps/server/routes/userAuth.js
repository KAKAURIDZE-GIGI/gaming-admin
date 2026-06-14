const express = require("express");
const {
  register,
  verify,
  login,
  me,
} = require("../controllers/userAuthController");
const { protectUser } = require("../middleware/userAuth");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/login", login);
router.get("/me", protectUser, me);

module.exports = router;
