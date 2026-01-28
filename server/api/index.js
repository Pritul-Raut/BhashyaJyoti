const app = require("../server"); // Import the app from server.js

// This function handles the request and response for Vercel
module.exports = (req, res) => {
  return app(req, res);
};