const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const router = express.Router();
router.use(protect);

/**
 * GET SETTINGS
 * GET /api/settings
 */
router.get("/", getSettings);

/**
 * UPDATE SETTINGS
 * PUT /api/settings
 */
router.put("/", updateSettings);

module.exports = router;
