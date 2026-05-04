const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Studio = require("../models/Studio");
const sendEmail = require("../utils/mailer");

const router = express.Router();

// 🔧 Helper functions
const normalizeClassName = (name) => name.toLowerCase().trim();
const normalizeEmail = (email) => email.toLowerCase().trim();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    let { className, email, password, phone } = req.body;

    if (!className || !password || !email || !phone) {
      return res.status(400).json({
        message: "className, email, phone and password are required",
      });
    }

    className = normalizeClassName(className);
    email = normalizeEmail(email);
    phone = phone.trim();

    let studio = await Studio.findOne({ className });

    // CASE A: Already verified
    if (studio && studio.emailVerified) {
      return res
        .status(400)
        .json({ message: "Dance class name already registered" });
    }

    // CASE B: Exists but NOT verified → update
    if (studio && !studio.emailVerified) {
      const existingByEmail = await Studio.findOne({
        email,
        _id: { $ne: studio._id },
      });

      if (existingByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const existingByPhone = await Studio.findOne({
        phone,
        _id: { $ne: studio._id },
      });

      if (existingByPhone) {
        return res.status(400).json({ message: "Phone already registered" });
      }

      studio.email = email;
      studio.phone = phone;
      studio.password = await bcrypt.hash(password, 10);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      studio.emailVerificationOtp = otp;
      studio.emailVerificationOtpExpires = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await studio.save();

      await sendEmail({
        to: studio.email,
        subject: "RhythmFlow Email Verification OTP",
        text: `Your OTP is: ${otp}`,
      });

      return res.status(200).json({
        message: "Updated existing unverified studio. Verify email.",
        studio,
      });
    }

    // CASE C: Fresh registration
    const existingByEmail = await Studio.findOne({ email });
    if (existingByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingByPhone = await Studio.findOne({ phone });
    if (existingByPhone) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    studio = await Studio.create({
      className,
      email,
      phone,
      password: hashed,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    studio.emailVerificationOtp = otp;
    studio.emailVerificationOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await studio.save();

    await sendEmail({
      to: studio.email,
      subject: "RhythmFlow Email Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(201).json({
      message: "Registered successfully. Verify email.",
      studio,
    });
  } catch (e) {
    console.error("Register Error", e);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    let { className, password } = req.body;

    if (!className || !password) {
      return res
        .status(400)
        .json({ message: "ClassName and password are required" });
    }

    className = normalizeClassName(className);

    const studio = await Studio.findOne({ className });

    if (!studio) {
      return res.status(400).json({ message: "Dance class Not found" });
    }

    const isMatch = await bcrypt.compare(password, studio.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Not verified → send OTP
    if (!studio.emailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      studio.emailVerificationOtp = otp;
      studio.emailVerificationOtpExpires = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await studio.save();

      await sendEmail({
        to: studio.email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });

      return res.json({
        requiresVerification: true,
        message: "OTP sent to email",
        studio,
      });
    }

    const token = jwt.sign({ studioId: studio._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, studio });
  } catch (err) {
    console.error("Login Error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    let { className, email, phone } = req.body;

    if (!className && !email && !phone) {
      return res
        .status(400)
        .json({ message: "Provide className or email or phone" });
    }

    let studio;

    if (className) {
      className = normalizeClassName(className);
      studio = await Studio.findOne({ className });
    } else if (email) {
      email = normalizeEmail(email);
      studio = await Studio.findOne({ email });
    } else {
      studio = await Studio.findOne({ phone });
    }

    if (!studio) {
      return res.status(400).json({ message: "No account found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    studio.resetOtp = otp;
    studio.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await studio.save();

    await sendEmail({
      to: studio.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password-otp", async (req, res) => {
  try {
    let { className, email, phone, otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({ message: "OTP & newPassword required" });
    }

    let studio;

    if (className) {
      className = normalizeClassName(className);
      studio = await Studio.findOne({ className });
    } else if (email) {
      email = normalizeEmail(email);
      studio = await Studio.findOne({ email });
    } else {
      studio = await Studio.findOne({ phone });
    }

    if (!studio || studio.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (studio.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    studio.password = await bcrypt.hash(newPassword, 10);
    studio.resetOtp = undefined;
    studio.resetOtpExpires = undefined;

    await studio.save();

    res.json({ message: "Password reset successful" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= VERIFY EMAIL =================
router.post("/verify-email", async (req, res) => {
  try {
    let { className, email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    let studio;

    if (className) {
      className = normalizeClassName(className);
      studio = await Studio.findOne({ className });
    } else if (email) {
      email = normalizeEmail(email);
      studio = await Studio.findOne({ email });
    }

    if (!studio || studio.emailVerificationOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (studio.emailVerificationOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    studio.emailVerified = true;
    studio.emailVerificationOtp = undefined;
    studio.emailVerificationOtpExpires = undefined;

    await studio.save();

    const token = jwt.sign({ studioId: studio._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Email verified", token, studio });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;