// server/models/Resource.js
const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  // 1. ORGANIZATION (Filtering)
  language: {
    type: String,
    required: true,
    enum: ["English", "Japanese", "German", "Sanskrit"],
    index: true // Makes searching faster
  },
  category: {
    type: String,
    required: true,
    enum: ["Alphabet", "Grammar", "Vocabulary", "Stories", "AdvancedPractice"]
  },
  
  // 2. HIERARCHY (For your Level system)
  level: { type: Number, default: 1 }, // Level 1, 2, 3...
  subType: { type: String, default: "General" }, // e.g., 'Kanji', 'Hiragana', 'Tenses', 'Nouns'

  // 3. ACCESS CONTROL
  isFree: { type: Boolean, default: false }, // If false, user needs 'Subscription' or 'Course'

  // 4. THE CONTENT (Flexible based on category)
  title: { type: String, required: true }, // e.g., "Basic Greetings" or "Letter A"
  
  data: [{
    term: String,        // The word/letter (e.g., "Hello" or "あ")
    pronunciation: String, // Phonetic (e.g., "Konnichiwa")
    
    // Translations (As requested: Hindi default, Marathi fallback)
    translation: {
      hindi: String,
      marathi: String,
      english: String // Useful if source is Japanese
    },
    
    definition: String,  // For Grammar rules
    exampleSentence: String,
    audioUrl: String,    // URL to audio file (optional for now)
    image: String        // URL to visual aid (optional)
  }],

  // Metadata
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", ResourceSchema);