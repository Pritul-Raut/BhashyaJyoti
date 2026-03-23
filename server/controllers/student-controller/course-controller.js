const Course = require("../../models/Course");
const User = require("../../models/User");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      primaryLanguage,
      sortBy = "price-lowtohigh",
    } = req.query;

    // ─── BUG 3 FIX ────────────────────────────────────────────────────────────
    // 1. Always filter to published courses only.
    //    The Course schema has a typo: "isPublised" (one 's') — match it exactly.
    // 2. Only add a filter key if the query param actually arrived.
    //    Previously, an empty string "" was passed to split(",") which produced
    //    ["""] and matched nothing — causing a blank white page.
    // ──────────────────────────────────────────────────────────────────────────
    let filters = { isPublised: true };

    if (category && category.trim().length > 0) {
      filters.category = { $in: category.split(",").map((s) => s.trim()) };
    }
    if (level && level.trim().length > 0) {
      filters.level = { $in: level.split(",").map((s) => s.trim()) };
    }
    if (primaryLanguage && primaryLanguage.trim().length > 0) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",").map((s) => s.trim()) };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":  sortParam.pricing = 1;  break;
      case "price-hightolow":  sortParam.pricing = -1; break;
      case "title-atoz":       sortParam.title   = 1;  break;
      case "title-ztoa":       sortParam.title   = -1; break;
      default:                 sortParam.pricing = 1;  break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error("getAllStudentViewCourses error:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({ success: true, data: courseDetails });
  } catch (e) {
    console.error("getStudentViewCourseDetails error:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const alreadyPurchased =
      user.purchasedItems &&
      user.purchasedItems.findIndex(
        (item) => item.itemId.toString() === id
      ) > -1;

    res.status(200).json({ success: true, data: alreadyPurchased });
  } catch (e) {
    console.error("checkCoursePurchaseInfo error:", e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};