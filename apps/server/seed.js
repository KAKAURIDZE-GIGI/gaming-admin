require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Wheel = require("./models/Wheel");
const Slot = require("./models/Slot");
const Admin = require("./models/Admin");

const wheels = [
  {
    name: "Daily Bonus Wheel",
    description: "Spin once a day for free rewards!",
    status: "active",
    segments: [
      { label: "100 Coins", color: "#EF4444", weight: 30, prizeType: "coins", prizeAmount: 100, imageUrl: "https://placehold.co/60x60/EF4444/FFF?text=100" },
      { label: "500 Coins", color: "#3B82F6", weight: 20, prizeType: "coins", prizeAmount: 500, imageUrl: "https://placehold.co/60x60/3B82F6/FFF?text=500" },
      { label: "Free Spin", color: "#10B981", weight: 15, prizeType: "freeSpin", prizeAmount: 1, imageUrl: "https://placehold.co/60x60/10B981/FFF?text=FS" },
      { label: "Nothing", color: "#6B7280", weight: 25, prizeType: "nothing", prizeAmount: 0, imageUrl: "https://placehold.co/60x60/6B7280/FFF?text=X" },
      { label: "Bonus x2", color: "#F59E0B", weight: 5, prizeType: "bonus", prizeAmount: 2, imageUrl: "https://placehold.co/60x60/F59E0B/000?text=2x" },
      { label: "1000 Coins", color: "#8B5CF6", weight: 5, prizeType: "coins", prizeAmount: 1000, imageUrl: "https://placehold.co/60x60/8B5CF6/FFF?text=1K" },
    ],
    maxSpinsPerUser: 1,
    spinCost: 0,
    betSizes: [10, 25, 50],
    backgroundColor: "#1F2937",
    borderColor: "#F59E0B",
  },
  {
    name: "Premium Spin Wheel",
    description: "High-stakes wheel with premium rewards.",
    status: "active",
    segments: [
      { label: "5000 Coins", color: "#DC2626", weight: 10, prizeType: "coins", prizeAmount: 5000, imageUrl: "https://placehold.co/60x60/DC2626/FFF?text=5K" },
      { label: "10 Free Spins", color: "#2563EB", weight: 15, prizeType: "freeSpin", prizeAmount: 10, imageUrl: "https://placehold.co/60x60/2563EB/FFF?text=10FS" },
      { label: "Bonus x5", color: "#059669", weight: 10, prizeType: "bonus", prizeAmount: 5, imageUrl: "https://placehold.co/60x60/059669/FFF?text=5x" },
      { label: "Nothing", color: "#4B5563", weight: 40, prizeType: "nothing", prizeAmount: 0, imageUrl: "https://placehold.co/60x60/4B5563/FFF?text=X" },
      { label: "20000 Coins", color: "#D97706", weight: 5, prizeType: "coins", prizeAmount: 20000, imageUrl: "https://placehold.co/60x60/D97706/FFF?text=20K" },
      { label: "1000 Coins", color: "#7C3AED", weight: 20, prizeType: "coins", prizeAmount: 1000, imageUrl: "https://placehold.co/60x60/7C3AED/FFF?text=1K" },
    ],
    maxSpinsPerUser: 5,
    spinCost: 500,
    betSizes: [100, 500, 1000],
    backgroundColor: "#111827",
    borderColor: "#EAB308",
  },
  {
    name: "Holiday Special Wheel",
    description: "Limited edition wheel for the holiday season.",
    status: "draft",
    segments: [
      { label: "Gift Box", color: "#EF4444", weight: 40, prizeType: "coins", prizeAmount: 250, imageUrl: "https://placehold.co/60x60/EF4444/FFF?text=Gift" },
      { label: "Candy Cane", color: "#22C55E", weight: 35, prizeType: "freeSpin", prizeAmount: 5, imageUrl: "https://placehold.co/60x60/22C55E/FFF?text=Candy" },
      { label: "Jackpot", color: "#EAB308", weight: 25, prizeType: "bonus", prizeAmount: 100, imageUrl: "https://placehold.co/60x60/EAB308/000?text=JP" },
    ],
    maxSpinsPerUser: 3,
    spinCost: 100,
    betSizes: [50, 100, 250],
    backgroundColor: "#1a1a2e",
    borderColor: "#e94560",
  },
];

const slots = [
  {
    name: "Fruit Frenzy",
    description: "Classic fruit slot — spin across 1, 3 or 9 paylines.",
    status: "active",
    winRate: 30,
    betSizes: [5, 10, 25, 50, 100],
  },
  {
    name: "Berry Bonanza",
    description: "High-volatility fruit reels with bigger stakes.",
    status: "active",
    winRate: 25,
    betSizes: [10, 50, 100, 250, 500],
  },
];

async function seed() {
  await connectDB();

  await Promise.all([Wheel.deleteMany({}), Slot.deleteMany({})]);

  await Wheel.insertMany(wheels);
  await Slot.insertMany(slots);
  console.log(`Seeded ${wheels.length} wheels, ${slots.length} slots`);

  // Default admin (idempotent). Uses .save() so the password gets hashed.
  const email = "admin@gaming.com";
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await new Admin({
      name: "Super Admin",
      email,
      password: "admin123",
      role: "superadmin",
    }).save();
    console.log(`Created admin: ${email} / admin123`);
  }

  await mongoose.connection.close();
  console.log("Seed complete");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
