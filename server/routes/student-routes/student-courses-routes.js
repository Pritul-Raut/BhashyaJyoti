const express = require("express");
const {
  getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);

// The frontend calls: /student/courses-bought/purchased/:studentId
router.get("/purchased/:studentId", getCoursesByStudentId);

module.exports = router;
