const express = require("express"); // <--- THIS WAS MISSING
const { 
  createTest, 
  getTests, 
  getTestById, 
  submitTest,
  createTestSeries,     // New
  getAllTestSeries,     // New
  getTestSeriesById     // New
} = require("../../controllers/test-controller");

const router = express.Router();

// --- Individual Mock Test Routes ---
router.post("/create", createTest);
router.get("/get", getTests);
router.get("/get/:id", getTestById);
router.post("/submit", submitTest);

// --- Test Series Routes ---
router.post("/series/create", createTestSeries);
router.get("/series/get", getAllTestSeries);
router.get("/series/get/:id", getTestSeriesById);

module.exports = router;