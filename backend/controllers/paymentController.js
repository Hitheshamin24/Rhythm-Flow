const Student = require("../models/Student");
const Payment = require("../models/Payment");

/**
 * Helper: returns the first day of a given month in UTC.
 * year: full year (e.g. 2026), month: 1-based (1=Jan … 12=Dec)
 * If not provided, defaults to the current month.
 */
const getMonthStart = (year, month) => {
  const now = new Date();
  const y = year !== undefined ? parseInt(year, 10) : now.getUTCFullYear();
  // month param is 1-based; Date.UTC expects 0-based
  const m = month !== undefined ? parseInt(month, 10) - 1 : now.getUTCMonth();
  return new Date(Date.UTC(y, m, 1));
};

/**
 * GET /api/payments?year=2026&month=10
 * Returns all active students split into paid/unpaid for the given month.
 * Defaults to the current month when no query params are supplied.
 */
const getPayments = async (req, res) => {
  try {
    const forMonth = getMonthStart(req.query.year, req.query.month);
    const nextMonth = new Date(
      Date.UTC(forMonth.getUTCFullYear(), forMonth.getUTCMonth() + 1, 1)
    );

    // Fetch active students who were registered ON OR BEFORE the end of the viewed month.
    // Students registered after this month should not appear in past month views.
    const [students, payments] = await Promise.all([
      Student.find({
        studio: req.studioId,
        isActive: true,
        createdAt: { $lt: nextMonth }, // registered before the next month starts
      }).lean(),
      Payment.find({
        studio: req.studioId,
        forMonth: { $gte: forMonth, $lt: nextMonth },
      })
        .select("student")
        .lean(),
    ]);

    // Build a set of student IDs that have a Payment record for this month
    const paidStudentIds = new Set(payments.map((p) => String(p.student)));

    const paid = students.filter((s) => paidStudentIds.has(String(s._id)));
    const unpaid = students.filter((s) => !paidStudentIds.has(String(s._id)));

    res.json({
      total: students.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      paid,
      unpaid,
      forMonth: forMonth.toISOString(),
    });
  } catch (err) {
    console.error("Payment list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/payments/pay/:id
 * Body: { year, month } — defaults to current month.
 * Marks a student as paid for the given month by creating a Payment record.
 */
const markAsPaid = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      studio: req.studioId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const forMonth = getMonthStart(req.body.year, req.body.month);

    // Keep legacy isPaid flag in sync when operating on the current month
    const now = new Date();
    const currentMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    if (forMonth.getTime() === currentMonthStart.getTime()) {
      student.isPaid = true;
      student.lastPaidDate = new Date();
      await student.save();
    }

    // Upsert a Payment record for the given month
    try {
      await Payment.findOneAndUpdate(
        { studio: req.studioId, student: student._id, forMonth },
        { amount: student.monthlyFee || 0, paidAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (dupErr) {
      // Duplicate key on unique index means payment already exists — that is fine
      if (dupErr.code !== 11000) throw dupErr;
    }

    res.json({ message: "Marked as paid", student });
  } catch (err) {
    console.error("Payment pay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/payments/unpay/:id
 * Body: { year, month } — defaults to current month.
 * Removes the Payment record for that month (marks student as unpaid).
 */
const markAsUnpaid = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      studio: req.studioId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const forMonth = getMonthStart(req.body.year, req.body.month);
    const nextMonth = new Date(
      Date.UTC(forMonth.getUTCFullYear(), forMonth.getUTCMonth() + 1, 1)
    );

    // Keep legacy isPaid flag in sync when operating on the current month
    const now = new Date();
    const currentMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    if (forMonth.getTime() === currentMonthStart.getTime()) {
      student.isPaid = false;
      // Only wipe lastPaidDate when it falls within the month being undone
      if (
        student.lastPaidDate &&
        student.lastPaidDate >= forMonth &&
        student.lastPaidDate < nextMonth
      ) {
        student.lastPaidDate = null;
      }
      await student.save();
    }

    // Delete the Payment record for that month
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

/**
 * PUT /api/payments/reset
 * Legacy endpoint — resets the isPaid flag on all active students.
 * No longer needed with month-wise tracking but kept for backward compatibility.
 */
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

module.exports = {
  resetPayments,
  markAsPaid,
  markAsUnpaid,
  getPayments,
};
