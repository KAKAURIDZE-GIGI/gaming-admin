const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Verifies the Bearer JWT and attaches the admin to req.admin.
async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin no longer exists" });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { protect };
