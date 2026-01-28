require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// --- 1. IMPORT ROUTES ---
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentOrderRoutes = require("./routes/student-routes/order-routes"); // The "Writer"
const testRoutes = require("./routes/test-routes");
const resourceRouter = require("./routes/resource-routes/index");
const studentTestSeriesRoutes = require("./routes/student-routes/test-series-routes");


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => console.log(e));

// --- 2. REGISTER ROUTES ---

// Auth
app.use("/auth", authRoutes);

// Media & Resources
app.use("/media", mediaRoutes);
app.use("/api/resource", resourceRouter);

// Instructor
app.use("/instructor/course", instructorCourseRoutes);

// Student - Courses & Progress
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

// Student - Buying & My Learning (CRITICAL SECTION)
app.use("/student/order", studentOrderRoutes); // Saves the purchase
app.use("/student/courses-bought", studentCoursesRoutes); // Fetches "My Learning"

// Tests
app.use("/api/test", testRoutes);
app.use("/student/test-series", studentTestSeriesRoutes);
// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});

// Only listen if we are NOT in Vercel (Localhost)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is now running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;