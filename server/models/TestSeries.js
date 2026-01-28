const mongoose = require("mongoose");

const TestSeriesSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  category: { type: String, required: true }, // e.g., Japanese, German
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  
  price: { type: Number, required: true }, // The cost of the whole bundle
  image: String, // Thumbnail
  
  // This is the key: An array of references to the actual Mock Tests
  tests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MockTest" }
  ],
  
  isPublished: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestSeries", TestSeriesSchema);