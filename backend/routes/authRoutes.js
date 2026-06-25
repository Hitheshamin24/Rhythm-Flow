const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPasswordOtp,
  verifyEmail,
} = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password-otp
router.post("/reset-password-otp", resetPasswordOtp);

// POST /api/auth/verify-email
router.post("/verify-email", verifyEmail);

module.exports = router;