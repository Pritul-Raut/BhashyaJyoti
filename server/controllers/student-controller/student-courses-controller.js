const User = require("../../models/User");
const Course = require("../../models/Course");
const TestSeries = require("../../models/TestSeries");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Find the User
    const user = await User.findById(studentId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        courses: [],
        testSeries: []
      });
    }

    // 2. Extract IDs from 'purchasedItems' (The new place we save to)
    const courseIds = user.purchasedItems
      .filter(item => item.itemType === 'Course')
      .map(item => item.itemId);

    const testSeriesIds = user.purchasedItems
      .filter(item => item.itemType === 'TestSeries')
      .map(item => item.itemId);

    // 3. Fetch Full Details from the respective collections
    const courses = await Course.find({ _id: { $in: courseIds } });
    const testSeries = await TestSeries.find({ _id: { $in: testSeriesIds } });

    // 4. Send response
    res.status(200).json({
      success: true,
      courses: courses,
      testSeries: testSeries,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      courses: [],
      testSeries: []
    });
  }
};

module.exports = { getCoursesByStudentId };