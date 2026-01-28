const mongoose = require("mongoose");

const TestResultSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest" },
  testTitle: String,
  
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }, // %
  resultStatus: { type: String, enum: ["Passed", "Failed"], default: "Failed" },
  
  // Store individual answers for detailed report
  answers: [
    {
      questionId: String,
      userResponse: mongoose.Schema.Types.Mixed, // String (Writing) or Array (MCQ IDs)
      isCorrect: Boolean,
      pointsEarned: Number
    }
  ],
  
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestResult", TestResultSchema);