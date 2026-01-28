const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  
  // 1. SYSTEM ROLE
  // 'user': Standard Learner
  // 'instructor': Content Creator (Can add Courses & Mock Tests)
  // 'admin': Platform Owner (You)
  role: {
    type: String,
    enum: ['user', 'instructor', 'admin'], 
    default: 'user'
  },

  // 2. BUSINESS ROLES (For the B2B/Organization section)
  // Allows a user to be a "Head" in one company and "Member" in another.
  organizationMemberships: [{
    organizationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Organization' 
    },
    organizationName: String, 
    orgRole: { 
      type: String, 
      enum: ['head', 'member'], 
      required: true 
    },
    joinedAt: { type: Date, default: Date.now }
  }],

  // 3. PURCHASES (Unlocks Content)
  purchasedItems: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { 
      type: String, 
      // *** CHANGE IS HERE: Added 'TestSeries' to this list ***
      enum: ['Course', 'MockTest', 'Subscription', 'BusinessPack', 'TestSeries'],
      required: true 
    },
    purchaseDate: { type: Date, default: Date.now }
  }],

  // 4. LEARNING PROFILE
  preferences: {
    nativeLanguage: { type: String, default: 'Hindi' }, 
    streak: { type: Number, default: 0 },
    lastLoginDate: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);