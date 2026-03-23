const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const User = require("../../models/User");

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [{ lectureId, viewed: true, dateViewed: new Date() }],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );
      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.error("markCurrentLectureAsViewed error:", error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // ─── FIX ──────────────────────────────────────────────────────────────────
    // StudentCourses collection is empty because the old order controller only
    // wrote to User.purchasedItems. We now check BOTH so that:
    //   - existing purchases (saved in User.purchasedItems) work immediately
    //   - future purchases (saved to StudentCourses by the new order controller)
    //     also work
    // ──────────────────────────────────────────────────────────────────────────
    let isPurchased = false;

    // Check 1: StudentCourses collection (new purchases after fix)
    const studentCourses = await StudentCourses.findOne({ userId });
    if (studentCourses?.courses?.length > 0) {
      isPurchased =
        studentCourses.courses.findIndex(
          (item) => item.courseId.toString() === courseId.toString()
        ) > -1;
    }

    // Check 2: User.purchasedItems (existing purchases before fix)
    if (!isPurchased) {
      const user = await User.findById(userId);
      if (user?.purchasedItems?.length > 0) {
        isPurchased = user.purchasedItems.some(
          (item) =>
            item.itemId.toString() === courseId.toString() &&
            item.itemType === "Course"
        );
      }
    }

    if (!isPurchased) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }

    // User has access — fetch their progress
    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress.lecturesProgress.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: { courseDetails: course, progress: [], isPurchased: true },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error("getCurrentCourseProgress error:", error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// reset course progress
const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress not found!" });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;
    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.error("resetCurrentCourseProgress error:", error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};