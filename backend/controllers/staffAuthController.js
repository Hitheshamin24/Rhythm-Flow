const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");
const Studio = require("../models/Studio");
const sendEmail = require("../utils/mailer");

/**
 * POST /api/auth/staff-register
 * Register a new trainer. Creates a 'pending' record and notifies the Studio Owner.
 */
const staffRegister = async (req, res) => {
  try {
    const { name, email, password, studioId } = req.body;

    if (!name || !email || !password || !studioId) {
      return res
        .status(400)
        .json({ message: "name, email, password and studioId are required" });
    }

    // Check if the target studio exists
    const studio = await Studio.findById(studioId);
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    // Check if this email is already registered as a trainer
    const existingStaff = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (existingStaff) {
      return res.status(400).json({ message: "Email already registered as a trainer" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      studioId,
      status: "pending",
      role: "trainer",
    });

    // Notify the Studio Owner via email
    try {
      const message = `A new trainer has requested to join your studio "${studio.className}".\n\nTrainer Name: ${staff.name}\nTrainer Email: ${staff.email}\n\nPlease log in to your dashboard to approve or reject this request.`;
      await sendEmail({
        to: studio.email,
        subject: `RhythmFlow – New Trainer Request for ${studio.className}`,
        text: message,
      });
    } catch (mailErr) {
      // Don't fail the registration if email sending fails
      console.error("Owner notification email failed:", mailErr.message);
    }

    return res.status(201).json({
      message:
        "Registration submitted successfully. Your account is pending approval from the studio owner.",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        status: staff.status,
        role: staff.role,
      },
    });
  } catch (e) {
    console.error("Staff register error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/staff-login
 * Trainer login. Verifies credentials and checks approval status.
 */
const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const staff = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (!staff) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (staff.status === "pending") {
      return res.status(403).json({
        message:
          "Your account is awaiting approval from the studio owner. Please check back later.",
      });
    }

    if (staff.status === "rejected") {
      return res.status(403).json({
        message:
          "Your account has been rejected. Please contact the studio owner.",
      });
    }

    // status === 'approved'
    const token = jwt.sign(
      { studioId: staff.studioId, staffId: staff._id, role: "trainer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        studioId: staff.studioId,
        role: staff.role,
        status: staff.status,
      },
    });
  } catch (err) {
    console.error("Staff login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { staffRegister, staffLogin };
