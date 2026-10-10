const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");
const Studio = require("../models/Studio");
const sendEmail = require("../utils/mailer");
const generateOtp = require("../utils/generateOtp");
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
      if (existingStaff.status === "rejected") {
        // If they were previously rejected/removed, delete the old record to allow re-registration
        await Staff.deleteOne({ _id: existingStaff._id });
      } else {
        return res.status(400).json({ message: "Email already registered as a trainer" });
      }
    }

    const staff = await Staff.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
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

    const isMatch = password === staff.password;
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

const staffForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Provide email" });
    }

    const staff = await Staff.findOne({ email: email.toLowerCase().trim() });

    if (!staff) {
      return res.status(400).json({ message: "No account found for given email" });
    }

    const otp = generateOtp();
    staff.resetOtp = otp;
    staff.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await staff.save();

    const message = `Your RhythmFlow staff password reset OTP is: ${otp}. It is valid for 10 minutes.`;
    await sendEmail({ to: staff.email, subject: "RhythmFlow Password Reset OTP", text: message });

    return res.json({ message: "OTP sent to your registered email. Valid for 10 minutes." });
  } catch (e) {
    console.error("Staff forgot password error", e);
    res.status(500).json({ message: "Server error" });
  }
};

const staffResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and newPassword are required" });
    }

    const staff = await Staff.findOne({ email: email.toLowerCase().trim() });

    if (!staff || !staff.resetOtp || !staff.resetOtpExpires) {
      return res.status(400).json({ message: "No OTP request found for this account" });
    }

    if (staff.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (staff.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    staff.password = newPassword;
    staff.resetOtp = undefined;
    staff.resetOtpExpires = undefined;
    await staff.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (e) {
    console.error("Staff reset password with OTP error", e);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { staffRegister, staffLogin, staffForgotPassword, staffResetPasswordOtp };
