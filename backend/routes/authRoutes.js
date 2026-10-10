const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPasswordOtp,
  verifyEmail,
} = require("../controllers/authController");
const {
  staffRegister,
  staffLogin,
  staffForgotPassword,
  staffResetPasswordOtp,
} = require("../controllers/staffAuthController");

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

// POST /api/auth/staff-register  – Trainer registration
router.post("/staff-register", staffRegister);

// POST /api/auth/staff-login     – Trainer login
router.post("/staff-login", staffLogin);

// POST /api/auth/staff-forgot-password
router.post("/staff-forgot-password", staffForgotPassword);

// POST /api/auth/staff-reset-password-otp
router.post("/staff-reset-password-otp", staffResetPasswordOtp);

module.exports = router;