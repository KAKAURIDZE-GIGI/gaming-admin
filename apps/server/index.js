require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resourceRouter = require("./routes/resource");
const authRoutes = require("./routes/auth");
const Leaderboard = require("./models/Leaderboard");
const Raffle = require("./models/Raffle");
const Wheel = require("./models/Wheel");
const { protect } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.use("/api/auth", authRoutes);

// Resources — all guarded by JWT (`protect`).
app.use(
  "/api/leaderboards",
  resourceRouter(Leaderboard, { label: "Leaderboard", arrayFields: ["prizes"] }, [protect]),
);
app.use(
  "/api/raffles",
  resourceRouter(Raffle, { label: "Raffle", arrayFields: ["prizes"] }, [protect]),
);
app.use(
  "/api/wheels",
  resourceRouter(Wheel, { label: "Wheel", arrayFields: ["segments"] }, [protect]),
);

// Central error handler so async controller throws return JSON, not HTML.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
