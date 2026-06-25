const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();
router.use(protect);

// POST /api/students
// body: { name, parentName, phone, email, monthlyFee, batch }
router.post("/", createStudent);

// get /api students
// get all students for this studio
router.get("/", getStudents);

// GET api/studets:id
// get single student only if belongs to this studio
router.get("/:id", getStudentById);

// PUT /api/students/:id
// update student
router.put("/:id", updateStudent);

// DELETE /api/students/:id
// delete student
router.delete("/:id", deleteStudent);

module.exports = router;
