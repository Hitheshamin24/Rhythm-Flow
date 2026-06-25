const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  resetPayments,
  markAsPaid,
  markAsUnpaid,
  getPayments,
} = require("../controllers/paymentController");

const router = express.Router();

// all payment routes are protected
router.use(protect);

// PUT /api/payments/reset  -> mark all students as unpaid for this studio
router.put("/reset", resetPayments);

// PUT /api/payments/pay/:id  -> mark student as paid
router.put("/pay/:id", markAsPaid);

// PUT /api/payments/unpay/:id  -> mark student as unpaid
router.put("/unpay/:id", markAsUnpaid);

// GET /api/payments  -> summary + paid list + unpaid list
router.get("/", getPayments);

module.exports = router;
