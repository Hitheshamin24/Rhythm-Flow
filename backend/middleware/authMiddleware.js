const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/**
 * protect
 * Verifies the JWT token on every protected request.
 *
 * For Studio Owners the token payload contains { studioId }.
 * For Trainers the token payload contains { studioId, staffId, role: 'trainer' }.
 *
 * After verification the middleware attaches:
 *   req.studioId  – ObjectId of the studio (always present)
 *   req.role      – 'owner' | 'trainer'
 *   req.staffId   – ObjectId of the staff member (trainers only)
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.studioId = new mongoose.Types.ObjectId(decoded.studioId);

    // Distinguish trainers from studio owners
    if (decoded.role === "trainer" && decoded.staffId) {
      req.role = "trainer";
      req.staffId = new mongoose.Types.ObjectId(decoded.staffId);
      
      const Staff = require("../models/Staff");
      const staff = await Staff.findById(req.staffId);
      if (!staff || staff.status !== "approved") {
        return res.status(401).json({ message: "Trainer account not approved or removed" });
      }
    } else {
      req.role = "owner";
    }

    next();
  } catch (e) {
    console.error("Auth error", e.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * ownerOnly
 * Middleware that blocks trainers from accessing owner-only endpoints.
 * Must be used AFTER protect.
 */
const ownerOnly = (req, res, next) => {
  if (req.role !== "owner") {
    return res
      .status(403)
      .json({ message: "Access denied: Studio Owner only" });
  }
  next();
};

module.exports = protect;
module.exports.ownerOnly = ownerOnly;
