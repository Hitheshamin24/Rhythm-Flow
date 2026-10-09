const express = require("express");
const protect = require("../middleware/authMiddleware");
const { ownerOnly } = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const router = express.Router();
// Settings is restricted to Studio Owners – trainers cannot access this
router.use(protect, ownerOnly);

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
