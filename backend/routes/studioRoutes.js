const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  verifyProfileOtp,
  changePassword,
} = require("../controllers/studioController");

const router = express.Router();

// all routes here require auth
router.use(protect);

/**
 * GET /api/studio/me
 * Get current studio profile
 */
router.get("/me", getProfile);

/**
 * PUT /api/studio/me
 * Update email, phone, className with OTP for email/phone change
 * body: { email?, phone?, className? }
 */
router.put("/me", updateProfile);

/**
 * POST /api/studio/verify-profile-otp
 * body: { otp }
 * Confirms pendingEmail / pendingPhone using OTP
 */
router.post("/verify-profile-otp", verifyProfileOtp);

/**
 * POST /api/studio/change-password
 * body: { currentPassword, newPassword }
 */
router.post("/change-password", changePassword);

module.exports = router;
