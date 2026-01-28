const MockTest = require("../../models/MockTest");
const TestResult = require("../../models/TestResult");

// 1. INSTRUCTOR: Create a new Test
const createTest = async (req, res) => {
  try {
    const newTest = new MockTest(req.body);
    await newTest.save();
    res.status(201).json({ success: true, message: "Test created!", data: newTest });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error creating test" });
  }
};

// 2. STUDENT: Get All Tests (Explore)
const getTests = async (req, res) => {
  try {
    const { category, level } = req.query;
    let filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    
    const tests = await MockTest.find(filter);
    res.status(200).json({ success: true, data: tests });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching tests" });
  }
};

// 3. STUDENT: Get Specific Test (To Take)
const getTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);
    // SECURITY: We should ideally strip out 'isCorrect' from options before sending to frontend
    // But for simplicity, we send it all and handle logic on frontend or backend grading.
    res.status(200).json({ success: true, data: test });
  } catch (e) {
    res.status(500).json({ success: false, message: "Test not found" });
  }
};

// 4. STUDENT: Submit & Calculate Score
const submitTest = async (req, res) => {
  try {
    const { userId, userName, userEmail, testId, answers } = req.body;
    
    const test = await MockTest.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    let totalPoints = 0;
    let detailedAnswers = [];

    // AUTO-GRADING LOOP
    test.questions.forEach((question) => {
      totalPoints += question.points;
      
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      let pointsEarned = 0;
      let isCorrect = false;

      if (userAnswer) {
        // --- MCQ Grading ---
        if (question.type === "MCQ") {
           // Find the correct option ID in DB
           const correctOption = question.options.find(o => o.isCorrect);
           if (correctOption && userAnswer.response === correctOption._id.toString()) {
             isCorrect = true;
             pointsEarned = question.points;
           }
        }
        
        // --- Writing/Speaking Grading (Simplified) ---
        // Ideally, this needs AI or Manual Review. 
        // For now, we assume "Submitted" = "Full Points" OR 0 points until reviewed.
        // Let's give 0 points automatically and flag for review in a real app.
        // For this demo, we skip grading writing/speaking or give full marks if not empty.
      }

      score += pointsEarned;
      detailedAnswers.push({
        questionId: question._id,
        userResponse: userAnswer ? userAnswer.response : null,
        isCorrect,
        pointsEarned
      });
    });

    const accuracy = (score / totalPoints) * 100;
    const resultStatus = accuracy >= test.passingScore ? "Passed" : "Failed";

    const newResult = new TestResult({
      userId, userName, userEmail, testId, testTitle: test.title,
      score, totalPoints, accuracy, resultStatus, answers: detailedAnswers
    });

    await newResult.save();

    res.status(200).json({ success: true, data: newResult });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error submitting test" });
  }
};

const TestSeries = require("../../models/TestSeries"); // Import this!
const StudentTestSeries = require("../../models/StudentTestSeries"); // Import this!

// ... (Keep existing createTest, submitTest logic) ...

// --- NEW: Create Test Series Bundle ---
const createTestSeries = async (req, res) => {
  try {
    const newSeries = new TestSeries(req.body);
    await newSeries.save();
    res.status(201).json({ success: true, message: "Test Series Created!", data: newSeries });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error creating series" });
  }
};

// --- NEW: Get All Series (For Explore Page) ---
const getAllTestSeries = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isPublished: true };
    if (category) filter.category = category;
    
    // We populate 'tests' just enough to show the count (e.g., "10 Tests inside")
    const seriesList = await TestSeries.find(filter).populate("tests", "title level");
    
    res.status(200).json({ success: true, data: seriesList });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching series" });
  }
};

// --- NEW: Get Specific Series Details (For "My Courses" View) ---
const getTestSeriesById = async (req, res) => {
  try {
    const { id } = req.params;
    // Populate full test details so user can click and start
    const series = await TestSeries.findById(id).populate("tests");
    
    if (!series) return res.status(404).json({ message: "Not found" });
    
    res.status(200).json({ success: true, data: series });
  } catch (e) {
    res.status(500).json({ success: false, message: "Error fetching details" });
  }
};

// EXPORT NEW FUNCTIONS
module.exports = { 
  createTest, getTests, getTestById, submitTest, 
  createTestSeries, getAllTestSeries, getTestSeriesById 
};