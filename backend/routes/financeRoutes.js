// backend/routes/financeRoutes.js
const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getSummary,
  addExpense,
  deleteExpense,
  getMonthly,
} = require("../controllers/financeController");

const router = express.Router();
router.use(protect);

// GET Finance Summary
router.get("/summary", getSummary);

// ADD expense
// POST /api/finance/expense
router.post("/expense", addExpense);

// DELETE expense
router.delete("/expense/:id", deleteExpense);

// GET /api/finance/monthly?months=6
router.get("/monthly", getMonthly);

module.exports = router;
