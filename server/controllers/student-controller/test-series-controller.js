const TestSeries = require("../../models/TestSeries");

// Fetch ALL Test Series (For the Explore Page)
const getAllTestSeries = async (req, res) => {
  try {
    const testSeriesList = await TestSeries.find({});
    res.status(200).json({
      success: true,
      data: testSeriesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error fetching test series" });
  }
};

// Fetch SINGLE Test Series Details (For the Details/Buy Page)
const getTestSeriesDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const testSeries = await TestSeries.findById(id);

    if (!testSeries) {
      return res.status(404).json({
        success: false,
        message: "Test Series not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: testSeries,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error fetching details" });
  }
};

module.exports = { getAllTestSeries, getTestSeriesDetails };