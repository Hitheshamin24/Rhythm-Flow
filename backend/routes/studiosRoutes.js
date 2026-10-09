const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  listStudios,
  getPendingStaff,
  approveStaff,
  rejectStaff,
} = require("../controllers/staffController");

const router = express.Router();

/**
 * GET /api/studios/list
 * Public – returns id + className for all studios (used in trainer register dropdown).
 */
router.get("/list", listStudios);

/**
 * GET /api/staff/pending         – Owner only: list pending trainers
 * PUT /api/staff/:id/approve     – Owner only: approve a trainer
 * PUT /api/staff/:id/reject      – Owner only: reject a trainer
 */
router.get("/staff/pending", protect, getPendingStaff);
router.put("/staff/:id/approve", protect, approveStaff);
router.put("/staff/:id/reject", protect, rejectStaff);

module.exports = router;
