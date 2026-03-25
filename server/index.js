const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const db = {
  leaderboards: [
    {
      id: "lb-001",
      title: "Weekly Points Race",
      description: "Compete for the top spot in our weekly points leaderboard.",
      startDate: "2026-03-01T00:00:00.000Z",
      endDate: "2026-03-31T23:59:59.000Z",
      status: "active",
      scoringType: "points",
      prizes: [
        {
          id: "lp-001",
          rank: 1,
          name: "Gold Trophy",
          type: "coins",
          amount: 10000,
          imageUrl: "https://placehold.co/100x100/FFD700/000?text=1st",
        },
        {
          id: "lp-002",
          rank: 2,
          name: "Silver Trophy",
          type: "coins",
          amount: 5000,
          imageUrl: "https://placehold.co/100x100/C0C0C0/000?text=2nd",
        },
        {
          id: "lp-003",
          rank: 3,
          name: "Bronze Trophy",
          type: "freeSpin",
          amount: 50,
          imageUrl: "https://placehold.co/100x100/CD7F32/000?text=3rd",
        },
      ],
      maxParticipants: 500,
      createdAt: "2026-02-25T10:00:00.000Z",
      updatedAt: "2026-03-01T10:00:00.000Z",
    },
    {
      id: "lb-002",
      title: "Monthly Wins Championship",
      description:
        "Rack up wins across all games this month for massive rewards.",
      startDate: "2026-04-01T00:00:00.000Z",
      endDate: "2026-04-30T23:59:59.000Z",
      status: "draft",
      scoringType: "wins",
      prizes: [
        {
          id: "lp-004",
          rank: 1,
          name: "Champion Bundle",
          type: "bonus",
          amount: 200,
          imageUrl: "https://placehold.co/100x100/8B5CF6/FFF?text=1st",
        },
        {
          id: "lp-005",
          rank: 2,
          name: "Runner-Up Pack",
          type: "coins",
          amount: 8000,
          imageUrl: "https://placehold.co/100x100/6366F1/FFF?text=2nd",
        },
      ],
      maxParticipants: 1000,
      createdAt: "2026-03-10T08:00:00.000Z",
      updatedAt: "2026-03-10T08:00:00.000Z",
    },
    {
      id: "lb-003",
      title: "High Rollers League",
      description:
        "For the bold players — leaderboard based on total amount wagered.",
      startDate: "2026-02-01T00:00:00.000Z",
      endDate: "2026-02-28T23:59:59.000Z",
      status: "completed",
      scoringType: "wagered",
      prizes: [
        {
          id: "lp-006",
          rank: 1,
          name: "VIP Package",
          type: "bonus",
          amount: 500,
          imageUrl: "https://placehold.co/100x100/DC2626/FFF?text=VIP",
        },
        {
          id: "lp-007",
          rank: 2,
          name: "Elite Spins",
          type: "freeSpin",
          amount: 100,
          imageUrl: "https://placehold.co/100x100/EA580C/FFF?text=2nd",
        },
        {
          id: "lp-008",
          rank: 3,
          name: "Bonus Coins",
          type: "coins",
          amount: 3000,
          imageUrl: "https://placehold.co/100x100/F59E0B/000?text=3rd",
        },
      ],
      maxParticipants: 200,
      createdAt: "2026-01-20T12:00:00.000Z",
      updatedAt: "2026-02-28T23:59:59.000Z",
    },
  ],
  raffles: [
    {
      id: "rf-001",
      name: "Spring Mega Raffle",
      description:
        "Enter the biggest raffle of the season with incredible prizes!",
      startDate: "2026-03-15T00:00:00.000Z",
      endDate: "2026-04-15T23:59:59.000Z",
      drawDate: "2026-04-16T18:00:00.000Z",
      status: "active",
      ticketPrice: 100,
      maxTicketsPerUser: 10,
      prizes: [
        {
          id: "rp-001",
          name: "Jackpot Coins",
          type: "coins",
          amount: 50000,
          quantity: 1,
          imageUrl: "https://placehold.co/100x100/10B981/FFF?text=50K",
        },
        {
          id: "rp-002",
          name: "Bonus Bundle",
          type: "bonus",
          amount: 100,
          quantity: 5,
          imageUrl: "https://placehold.co/100x100/3B82F6/FFF?text=Bonus",
        },
        {
          id: "rp-003",
          name: "Free Spin Pack",
          type: "freeSpin",
          amount: 25,
          quantity: 20,
          imageUrl: "https://placehold.co/100x100/8B5CF6/FFF?text=Spins",
        },
      ],
      totalTicketLimit: 5000,
      createdAt: "2026-03-10T09:00:00.000Z",
      updatedAt: "2026-03-15T00:00:00.000Z",
    },
    {
      id: "rf-002",
      name: "Lucky Friday Draw",
      description:
        "Every Friday is a chance to win. Low ticket price, big rewards!",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-21T23:59:59.000Z",
      drawDate: "2026-03-22T12:00:00.000Z",
      status: "draft",
      ticketPrice: 10,
      maxTicketsPerUser: 50,
      prizes: [
        {
          id: "rp-004",
          name: "Quick Cash",
          type: "coins",
          amount: 5000,
          quantity: 3,
          imageUrl: "https://placehold.co/100x100/F59E0B/000?text=Cash",
        },
      ],
      totalTicketLimit: null,
      createdAt: "2026-03-18T14:00:00.000Z",
      updatedAt: "2026-03-18T14:00:00.000Z",
    },
    {
      id: "rf-003",
      name: "Valentine's Special Raffle",
      description:
        "A special raffle for Valentine's Day with exclusive prizes.",
      startDate: "2026-02-01T00:00:00.000Z",
      endDate: "2026-02-14T23:59:59.000Z",
      drawDate: "2026-02-15T15:00:00.000Z",
      status: "drawn",
      ticketPrice: 50,
      maxTicketsPerUser: 5,
      prizes: [
        {
          id: "rp-005",
          name: "Love Bundle",
          type: "bonus",
          amount: 250,
          quantity: 2,
          imageUrl: "https://placehold.co/100x100/EC4899/FFF?text=Love",
        },
        {
          id: "rp-006",
          name: "Heart Spins",
          type: "freeSpin",
          amount: 50,
          quantity: 10,
          imageUrl: "https://placehold.co/100x100/F43F5E/FFF?text=Heart",
        },
      ],
      totalTicketLimit: 2000,
      createdAt: "2026-01-25T11:00:00.000Z",
      updatedAt: "2026-02-15T15:00:00.000Z",
    },
  ],
  wheels: [
    {
      id: "wh-001",
      name: "Daily Bonus Wheel",
      description: "Spin once a day for free rewards!",
      status: "active",
      segments: [
        {
          id: "ws-001",
          label: "100 Coins",
          color: "#EF4444",
          weight: 30,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://placehold.co/60x60/EF4444/FFF?text=100",
        },
        {
          id: "ws-002",
          label: "500 Coins",
          color: "#3B82F6",
          weight: 20,
          prizeType: "coins",
          prizeAmount: 500,
          imageUrl: "https://placehold.co/60x60/3B82F6/FFF?text=500",
        },
        {
          id: "ws-003",
          label: "Free Spin",
          color: "#10B981",
          weight: 15,
          prizeType: "freeSpin",
          prizeAmount: 1,
          imageUrl: "https://placehold.co/60x60/10B981/FFF?text=FS",
        },
        {
          id: "ws-004",
          label: "Nothing",
          color: "#6B7280",
          weight: 25,
          prizeType: "nothing",
          prizeAmount: 0,
          imageUrl: "https://placehold.co/60x60/6B7280/FFF?text=X",
        },
        {
          id: "ws-005",
          label: "Bonus x2",
          color: "#F59E0B",
          weight: 5,
          prizeType: "bonus",
          prizeAmount: 2,
          imageUrl: "https://placehold.co/60x60/F59E0B/000?text=2x",
        },
        {
          id: "ws-006",
          label: "1000 Coins",
          color: "#8B5CF6",
          weight: 5,
          prizeType: "coins",
          prizeAmount: 1000,
          imageUrl: "https://placehold.co/60x60/8B5CF6/FFF?text=1K",
        },
      ],
      maxSpinsPerUser: 1,
      spinCost: 0,
      backgroundColor: "#1F2937",
      borderColor: "#F59E0B",
      createdAt: "2026-03-01T08:00:00.000Z",
      updatedAt: "2026-03-15T10:00:00.000Z",
    },
    {
      id: "wh-002",
      name: "Premium Spin Wheel",
      description: "High-stakes wheel with premium rewards.",
      status: "active",
      segments: [
        {
          id: "ws-007",
          label: "5000 Coins",
          color: "#DC2626",
          weight: 10,
          prizeType: "coins",
          prizeAmount: 5000,
          imageUrl: "https://placehold.co/60x60/DC2626/FFF?text=5K",
        },
        {
          id: "ws-008",
          label: "10 Free Spins",
          color: "#2563EB",
          weight: 15,
          prizeType: "freeSpin",
          prizeAmount: 10,
          imageUrl: "https://placehold.co/60x60/2563EB/FFF?text=10FS",
        },
        {
          id: "ws-009",
          label: "Bonus x5",
          color: "#059669",
          weight: 10,
          prizeType: "bonus",
          prizeAmount: 5,
          imageUrl: "https://placehold.co/60x60/059669/FFF?text=5x",
        },
        {
          id: "ws-010",
          label: "Nothing",
          color: "#4B5563",
          weight: 40,
          prizeType: "nothing",
          prizeAmount: 0,
          imageUrl: "https://placehold.co/60x60/4B5563/FFF?text=X",
        },
        {
          id: "ws-011",
          label: "20000 Coins",
          color: "#D97706",
          weight: 5,
          prizeType: "coins",
          prizeAmount: 20000,
          imageUrl: "https://placehold.co/60x60/D97706/FFF?text=20K",
        },
        {
          id: "ws-012",
          label: "1000 Coins",
          color: "#7C3AED",
          weight: 20,
          prizeType: "coins",
          prizeAmount: 1000,
          imageUrl: "https://placehold.co/60x60/7C3AED/FFF?text=1K",
        },
      ],
      maxSpinsPerUser: 5,
      spinCost: 500,
      backgroundColor: "#111827",
      borderColor: "#EAB308",
      createdAt: "2026-03-05T14:00:00.000Z",
      updatedAt: "2026-03-20T09:00:00.000Z",
    },
    {
      id: "wh-003",
      name: "Holiday Special Wheel",
      description: "Limited edition wheel for the holiday season.",
      status: "draft",
      segments: [
        {
          id: "ws-013",
          label: "Gift Box",
          color: "#EF4444",
          weight: 40,
          prizeType: "coins",
          prizeAmount: 250,
          imageUrl: "https://placehold.co/60x60/EF4444/FFF?text=Gift",
        },
        {
          id: "ws-014",
          label: "Candy Cane",
          color: "#22C55E",
          weight: 35,
          prizeType: "freeSpin",
          prizeAmount: 5,
          imageUrl: "https://placehold.co/60x60/22C55E/FFF?text=Candy",
        },
        {
          id: "ws-015",
          label: "Jackpot",
          color: "#EAB308",
          weight: 25,
          prizeType: "bonus",
          prizeAmount: 100,
          imageUrl: "https://placehold.co/60x60/EAB308/000?text=JP",
        },
      ],
      maxSpinsPerUser: 3,
      spinCost: 100,
      backgroundColor: "#1a1a2e",
      borderColor: "#e94560",
      createdAt: "2026-01-10T10:00:00.000Z",
      updatedAt: "2026-01-10T10:00:00.000Z",
    },
  ],
};

function getList(collection, query) {
  let items = [...db[collection]];

  if (query.status) {
    items = items.filter((item) => item.status === query.status);
  }

  const sortBy = query.sortBy || "createdAt";
  const order = query.order || "desc";
  items.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const total = items.length;
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return { data, total, page, limit };
}

app.get("/api/leaderboards", (req, res) => {
  res.json(getList("leaderboards", req.query));
});

app.get("/api/leaderboards/:id", (req, res) => {
  const item = db.leaderboards.find((l) => l.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Leaderboard not found" });
  res.json(item);
});

app.post("/api/leaderboards", (req, res) => {
  const now = new Date().toISOString();
  const item = {
    ...req.body,
    id: `lb-${uuidv4().slice(0, 8)}`,
    prizes: (req.body.prizes || []).map((p) => ({
      ...p,
      id: `lp-${uuidv4().slice(0, 8)}`,
    })),
    createdAt: now,
    updatedAt: now,
  };
  db.leaderboards.push(item);
  res.status(201).json(item);
});

app.put("/api/leaderboards/:id", (req, res) => {
  const index = db.leaderboards.findIndex((l) => l.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Leaderboard not found" });
  db.leaderboards[index] = {
    ...db.leaderboards[index],
    ...req.body,
    id: db.leaderboards[index].id,
    createdAt: db.leaderboards[index].createdAt,
    updatedAt: new Date().toISOString(),
    prizes: (req.body.prizes || []).map((p) => ({
      ...p,
      id: p.id || `lp-${uuidv4().slice(0, 8)}`,
    })),
  };
  res.json(db.leaderboards[index]);
});

app.delete("/api/leaderboards/:id", (req, res) => {
  const index = db.leaderboards.findIndex((l) => l.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Leaderboard not found" });
  db.leaderboards.splice(index, 1);
  res.status(204).send();
});

app.get("/api/raffles", (req, res) => {
  res.json(getList("raffles", req.query));
});

app.get("/api/raffles/:id", (req, res) => {
  const item = db.raffles.find((r) => r.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Raffle not found" });
  res.json(item);
});

app.post("/api/raffles", (req, res) => {
  const now = new Date().toISOString();
  const item = {
    ...req.body,
    id: `rf-${uuidv4().slice(0, 8)}`,
    prizes: (req.body.prizes || []).map((p) => ({
      ...p,
      id: `rp-${uuidv4().slice(0, 8)}`,
    })),
    createdAt: now,
    updatedAt: now,
  };
  db.raffles.push(item);
  res.status(201).json(item);
});

app.put("/api/raffles/:id", (req, res) => {
  const index = db.raffles.findIndex((r) => r.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Raffle not found" });
  db.raffles[index] = {
    ...db.raffles[index],
    ...req.body,
    id: db.raffles[index].id,
    createdAt: db.raffles[index].createdAt,
    updatedAt: new Date().toISOString(),
    prizes: (req.body.prizes || []).map((p) => ({
      ...p,
      id: p.id || `rp-${uuidv4().slice(0, 8)}`,
    })),
  };
  res.json(db.raffles[index]);
});

app.delete("/api/raffles/:id", (req, res) => {
  const index = db.raffles.findIndex((r) => r.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Raffle not found" });
  db.raffles.splice(index, 1);
  res.status(204).send();
});

app.get("/api/wheels", (req, res) => {
  res.json(getList("wheels", req.query));
});

app.get("/api/wheels/:id", (req, res) => {
  const item = db.wheels.find((w) => w.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Wheel not found" });
  res.json(item);
});

app.post("/api/wheels", (req, res) => {
  const now = new Date().toISOString();
  const item = {
    ...req.body,
    id: `wh-${uuidv4().slice(0, 8)}`,
    segments: (req.body.segments || []).map((s) => ({
      ...s,
      id: `ws-${uuidv4().slice(0, 8)}`,
    })),
    createdAt: now,
    updatedAt: now,
  };
  db.wheels.push(item);
  res.status(201).json(item);
});

app.put("/api/wheels/:id", (req, res) => {
  const index = db.wheels.findIndex((w) => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Wheel not found" });
  db.wheels[index] = {
    ...db.wheels[index],
    ...req.body,
    id: db.wheels[index].id,
    createdAt: db.wheels[index].createdAt,
    updatedAt: new Date().toISOString(),
    segments: (req.body.segments || []).map((s) => ({
      ...s,
      id: s.id || `ws-${uuidv4().slice(0, 8)}`,
    })),
  };
  res.json(db.wheels[index]);
});

app.delete("/api/wheels/:id", (req, res) => {
  const index = db.wheels.findIndex((w) => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Wheel not found" });
  db.wheels.splice(index, 1);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
