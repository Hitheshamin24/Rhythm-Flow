const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // The month this payment is for (stored as first day of that month in UTC)
    forMonth: {
      type: Date,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate payments for the same student in the same month
paymentSchema.index({ studio: 1, student: 1, forMonth: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);
