const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../lib/email");

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function signToken(user) {
  return jwt.sign({ id: user.id, role: "player" }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

// POST /api/user-auth/register
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const verifyToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    balance: Number(process.env.DEFAULT_BALANCE) || 1000,
    isVerified: false,
    verifyToken,
    verifyTokenExpires: new Date(Date.now() + VERIFY_TTL_MS),
  });

  const base = process.env.CLIENT_URL || "http://localhost:3001";
  const link = `${base}/verify?token=${verifyToken}`;
  try {
    await sendVerificationEmail(user.email, link);
  } catch (err) {
    // Don't fail registration if email send hiccups; user can request resend.
    console.error("verification email failed:", err.message);
  }

  res
    .status(201)
    .json({ message: "Registered. Check your email to verify your account." });
}

// POST /api/user-auth/verify  { token }
async function verify(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "token is required" });

  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpires: { $gt: new Date() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired link" });
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpires = undefined;
  await user.save();

  res.json({ message: "Account verified. You can now log in." });
}

// POST /api/user-auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in" });
  }
  res.json({ token: signToken(user), user });
}

// GET /api/user-auth/me
async function me(req, res) {
  res.json(req.user);
}

module.exports = { register, verify, login, me };
