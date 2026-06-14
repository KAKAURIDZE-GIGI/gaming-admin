// Add an admin user from the command line.
//
//   node scripts/createAdmin.js <email> <password> [name] [role]
//
// Examples:
//   node scripts/createAdmin.js admin@gaming.com secret123
//   node scripts/createAdmin.js boss@gaming.com pass123 "Big Boss" superadmin
//
// If the email already exists its password (and name/role) are updated.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

async function main() {
  const [, , email, password, name = "Admin", role = "admin"] = process.argv;

  if (!email || !password) {
    console.error(
      "Usage: node scripts/createAdmin.js <email> <password> [name] [role]",
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters");
    process.exit(1);
  }
  if (!["admin", "superadmin"].includes(role)) {
    console.error('Role must be "admin" or "superadmin"');
    process.exit(1);
  }

  await connectDB();

  const lowered = email.toLowerCase();
  let admin = await Admin.findOne({ email: lowered });
  if (admin) {
    admin.name = name;
    admin.role = role;
    admin.password = password; // re-hashed by pre-save hook
    await admin.save();
    console.log(`Updated admin: ${lowered} (${role})`);
  } else {
    await new Admin({ name, email: lowered, password, role }).save();
    console.log(`Created admin: ${lowered} (${role})`);
  }

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
