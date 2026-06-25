const Student = require("../models/Student");
const Payment = require("../models/Payment");

/**
 * Helper: returns the first day of the current month in UTC
 */
const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
};

const resetPayments = async (req, res) => {
  try {
    const result = await Student.updateMany(
      { studio: req.studioId, isActive: true },
      { $set: { isPaid: false } }
    );

    res.json({
      message: "All active students marked as unpaid.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Payment reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      studio: req.studioId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.isPaid = true;
    student.lastPaidDate = new Date();
    await student.save();

    // Also create a Payment record for the current month
    const forMonth = getCurrentMonthStart();
    try {
      await Payment.findOneAndUpdate(
        {
          studio: req.studioId,
          student: student._id,
          forMonth,
        },
        {
          amount: student.monthlyFee || 0,
          paidAt: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (dupErr) {
      // If a payment already exists for this month, that's fine — ignore
      if (dupErr.code !== 11000) throw dupErr;
    }

    res.json({ message: "Marked as paid", student });
  } catch (err) {
    console.error("Payment pay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const markAsUnpaid = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      studio: req.studioId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.isPaid = false;
    student.lastPaidDate = null;
    await student.save();

    // Remove the Payment record for the current month
    const forMonth = getCurrentMonthStart();
    await Payment.deleteOne({
      studio: req.studioId,
      student: student._id,
      forMonth,
    });

    res.json({ message: "Marked as unpaid", student });
  } catch (err) {
    console.error("Payment unpay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPayments = async (req, res) => {
  try {
    const students = await Student.find({
      studio: req.studioId,
      isActive: true,
    });

    const paid = students.filter((s) => s.isPaid);
    const unpaid = students.filter((s) => !s.isPaid);

    res.json({
      total: students.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      paid,
      unpaid,
    });
  } catch (err) {
    console.error("Payment list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  resetPayments,
  markAsPaid,
  markAsUnpaid,
  getPayments,
};
