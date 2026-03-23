const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// ── GET PROFILE ──────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── UPDATE PROFILE (name, profilePicture, nativeLanguage) ────────────────────
const updateProfile = async (req, res) => {
  try {
    const { userName, profilePicture, nativeLanguage } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (userName) user.userName = userName.trim();
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (nativeLanguage) user.preferences.nativeLanguage = nativeLanguage;

    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, message: "Profile updated", data: updated });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Current password is incorrect" });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── SUBSCRIBE TO LANGUAGE ─────────────────────────────────────────────────────
const subscribeLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const already = user.languageSubscriptions.find(
      (s) => s.language === language && s.isActive
    );
    if (already)
      return res.status(400).json({ success: false, message: `Already subscribed to ${language}` });

    user.languageSubscriptions.push({ language, subscribedAt: new Date(), isActive: true });
    await user.save();

    const updated = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, message: `Subscribed to ${language}`, data: updated });
  } catch (err) {
    console.error("subscribeLanguage error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── UNSUBSCRIBE FROM LANGUAGE ─────────────────────────────────────────────────
const unsubscribeLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const sub = user.languageSubscriptions.find((s) => s.language === language);
    if (sub) sub.isActive = false;

    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, message: `Unsubscribed from ${language}`, data: updated });
  } catch (err) {
    console.error("unsubscribeLanguage error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── UPDATE LOGIN STREAK ───────────────────────────────────────────────────────
// Call this on every successful login from the auth controller
const updateLoginStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = user.preferences.lastLoginDate
      ? new Date(user.preferences.lastLoginDate)
      : null;

    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day — no change
        return;
      } else if (diffDays === 1) {
        // Consecutive day — increment
        user.preferences.loginStreak += 1;
      } else {
        // Missed a day — reset
        user.preferences.loginStreak = 1;
      }
    } else {
      user.preferences.loginStreak = 1;
    }

    user.preferences.lastLoginDate = new Date();
    await user.save();
  } catch (err) {
    console.error("updateLoginStreak error:", err);
  }
};

// ── UPDATE LESSON STREAK ──────────────────────────────────────────────────────
// Call this whenever a lecture is marked as viewed
const updateLessonStreak = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLesson = user.preferences.lastLessonDate
      ? new Date(user.preferences.lastLessonDate)
      : null;

    if (lastLesson) {
      lastLesson.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today - lastLesson) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already updated today
        return res.status(200).json({ success: true, message: "Streak already updated today" });
      } else if (diffDays === 1) {
        user.preferences.lessonStreak += 1;
      } else {
        user.preferences.lessonStreak = 1;
      }
    } else {
      user.preferences.lessonStreak = 1;
    }

    user.preferences.lastLessonDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Lesson streak updated",
      data: {
        lessonStreak: user.preferences.lessonStreak,
        lastLessonDate: user.preferences.lastLessonDate,
      },
    });
  } catch (err) {
    console.error("updateLessonStreak error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  subscribeLanguage,
  unsubscribeLanguage,
  updateLoginStreak,
  updateLessonStreak,
};