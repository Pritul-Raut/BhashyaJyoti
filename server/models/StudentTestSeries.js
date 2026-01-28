const mongoose = require("mongoose");

const StudentTestSeriesSchema = new mongoose.Schema({
  userId: String,
  // List of series bought by this student
  series: [
    {
      seriesId: String,
      title: String,
      instructorId: String,
      dateOfPurchase: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model("StudentTestSeries", StudentTestSeriesSchema);