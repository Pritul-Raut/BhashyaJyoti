const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  subscribeLanguage,
  unsubscribeLanguage,
  updateLessonStreak,
} = require("../../controllers/profile-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

// All profile routes require authentication
router.get("/:userId",              authenticateMiddleware, getProfile);
router.put("/:userId",              authenticateMiddleware, updateProfile);
router.put("/:userId/password",     authenticateMiddleware, changePassword);
router.post("/:userId/subscribe",   authenticateMiddleware, subscribeLanguage);
router.post("/:userId/unsubscribe", authenticateMiddleware, unsubscribeLanguage);
router.post("/:userId/lesson-streak", authenticateMiddleware, updateLessonStreak);

module.exports = router;