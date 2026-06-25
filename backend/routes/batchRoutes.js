const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createBatch,
  getBatches,
  updateBatch,
  deleteBatch,
} = require("../controllers/batchController");

const router = express.Router();
router.use(protect);

// CREATE BATCH
// POST /api/batches
// body: { name, timing, days: ["Mon","Wed","Fri"] }
router.post("/", createBatch);

/**
 * GET ALL BATCHES OF A STUDIO
 * GET /api/batches
 */
router.get("/", getBatches);

// UPDATE BATCH
// PUT /api/batches/:id
// body: { name?, timing?, days? }
router.put("/:id", updateBatch);

/**
 * DELETE BATCH
 * DELETE /api/batches/:id
 */
router.delete("/:id", deleteBatch);

module.exports = router;
