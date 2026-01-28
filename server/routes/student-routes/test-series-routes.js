const express = require("express");
const { 
  getAllTestSeries, 
  getTestSeriesDetails 
} = require("../../controllers/student-controller/test-series-controller");

const router = express.Router();

// Route for the "Explore" list
router.get("/get-all", getAllTestSeries);

// Route for "Details" (This is the one you were missing!)
router.get("/details/:id", getTestSeriesDetails);

module.exports = router;