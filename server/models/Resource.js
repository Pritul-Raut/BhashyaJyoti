const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  // 1. ORGANIZATION
  language: {
    type: String,
    required: true,
    // ── To add a new language: just add it to this enum ──
    enum: ["English", "Japanese", "German", "Sanskrit", "French", "Spanish", "Mandarin", "Hindi", "Marathi"],
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Alphabet", "Grammar", "Vocabulary", "CommonPhrases", "Pronunciation", "Stories", "AdvancedPractice"],
  },

  // 2. HIERARCHY
  level:   { type: Number, default: 1 },
  subType: { type: String, default: "General" },

  // 3. ACCESS CONTROL
  isFree: { type: Boolean, default: false },

  // 4. CONTENT
  title: { type: String, required: true },

  data: [{
    term:          String,
    pronunciation: String,
    translation: {
      hindi:   String,
      marathi: String,
      english: String,
    },
    definition:      String,
    exampleSentence: String,
    audioUrl:        String,
    image:           String,
  }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resource", ResourceSchema);