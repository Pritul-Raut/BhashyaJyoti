// server/controllers/resource-controller/index.js
const Resource = require("../../models/Resource");

// 1. ADD NEW RESOURCE (Admin Only)
const addResource = async (req, res) => {
  try {
    const { language, category, level, isFree, title, data, subType } = req.body;

    const newResource = new Resource({
      language,
      category,
      level,
      subType,
      isFree,
      title,
      data
    });

    await newResource.save();

    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      data: newResource
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error adding resource"
    });
  }
};

// 2. GET RESOURCES (Student View)
// This supports filtering: /api/resource/get?lang=Japanese&category=Alphabet
const getResources = async (req, res) => {
  try {
    const { lang, category, level } = req.query;
    
    // Build a dynamic query object
    let query = {};
    if (lang) query.language = lang;
    if (category) query.category = category;
    if (level) query.level = level;

    const resources = await Resource.find(query);

    res.status(200).json({
      success: true,
      data: resources
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching resources"
    });
  }
};

// ADD THIS FUNCTION
const addBulkResources = async (req, res) => {
  try {
    const resources = req.body; // Expecting an Array []
    
    if (!Array.isArray(resources)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format. Expected an array of resources."
      });
    }

    // Mongoose method to insert many documents at once
    const result = await Resource.insertMany(resources);

    res.status(201).json({
      success: true,
      message: `${result.length} resources added successfully!`,
      data: result
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error performing bulk add"
    });
  }
};

// DON'T FORGET TO EXPORT IT
module.exports = { addResource, getResources, addBulkResources };