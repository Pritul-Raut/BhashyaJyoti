const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },

  // Profile
  profilePicture: { type: String, default: "" },

  role: {
    type: String,
    enum: ['user', 'instructor', 'admin'],
    default: 'user'
  },

  organizationMemberships: [{
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    organizationName: String,
    orgRole: { type: String, enum: ['head', 'member'], required: true },
    joinedAt: { type: Date, default: Date.now }
  }],

  purchasedItems: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: {
      type: String,
      enum: ['Course', 'MockTest', 'Subscription', 'BusinessPack', 'TestSeries'],
      required: true
    },
    purchaseDate: { type: Date, default: Date.now }
  }],

  // Language subscriptions — controls access to free resources per language
  languageSubscriptions: [{
    language: {
      type: String,
      enum: ['Japanese', 'German', 'French', 'Spanish', 'Mandarin', 'Sanskrit', 'Hindi', 'Marathi'],
      required: true
    },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  }],

  preferences: {
    nativeLanguage: { type: String, default: 'Hindi' },
    // Daily login streak
    loginStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    // Daily lesson completion streak
    lessonStreak: { type: Number, default: 0 },
    lastLessonDate: { type: Date, default: null },
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);