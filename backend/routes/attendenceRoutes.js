const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  saveOrUpdateAttendance,
  getWeeklyAttendance,
  getAttendanceSummary,
  getAttendanceByDate,
} = require("../controllers/attendenceController");

const router = express.Router();

router.use(protect);

// POST /api/attendance
// save or update attendance for a given date
// body:{ date"2025-11-27" presenet students:["StudentID1","StudentID2".....]}
router.post("/", saveOrUpdateAttendance);

// GET /api/attendance/weekly
// Returns present count for each day of current week (Mon–Sun)
router.get("/weekly", getWeeklyAttendance);

// GET /api/attendance/summary
// Returns { currentRate, lastRate } in %
router.get("/summary", getAttendanceSummary);

// GET /api/attendence?date=YYYY-MM-DD&batch=<batchId?>
// returns { date, presentStudents: [id, id, ...] } or 404 if not found
router.get("/", getAttendanceByDate);

module.exports = router;
