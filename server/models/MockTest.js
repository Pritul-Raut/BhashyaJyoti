const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["MCQ", "MSQ", "Speaking", "Writing", "Listening"],
    required: true,
  },
  questionText: { type: String, required: true },
  
  // For Listening/Speaking questions
  mediaUrl: { type: String, default: "" }, 
  
  // For MCQ/MSQ
  options: [
    {
      text: String,
      isCorrect: { type: Boolean, default: false },
    }
  ],
  
  // For Writing/Speaking (Reference answer for manual or AI grading)
  correctAnswerText: { type: String, default: "" }, 
  
  points: { type: Number, default: 1 },
});

const MockTestSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Japanese"
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  price: { type: Number, default: 0 }, // 0 = Free
  
  isPublished: { type: Boolean, default: false },
  questions: [QuestionSchema],
  
  timeLimit: { type: Number, default: 30 }, // Duration in minutes
  passingScore: { type: Number, default: 60 }, // Percentage to pass

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MockTest", MockTestSchema);