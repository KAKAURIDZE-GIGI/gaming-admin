require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resourceRouter = require("./routes/resource");
const authRoutes = require("./routes/auth");
const userAuthRoutes = require("./routes/userAuth");
const playRoutes = require("./routes/play");
const gamesRoutes = require("./routes/games");
const Leaderboard = require("./models/Leaderboard");
const Raffle = require("./models/Raffle");
const Wheel = require("./models/Wheel");
const Slot = require("./models/Slot");
const { protect } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.use("/api/auth", authRoutes); // admins
app.use("/api/user-auth", userAuthRoutes); // players

// Player-facing game configs (read-only, active only) + play actions.
app.use("/api/games", gamesRoutes);
app.use("/api/play", playRoutes);

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
app.use(
  "/api/slots",
  resourceRouter(Slot, { label: "Slot" }, [protect]),
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
