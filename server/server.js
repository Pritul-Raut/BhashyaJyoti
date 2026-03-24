require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentTestSeriesRoutes = require("./routes/student-routes/test-series-routes");
const profileRoutes = require("./routes/profile-routes");
const resourceRoutes = require("./routes/resource-routes"); // ← ADD THIS

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database Connection Error" });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully!",
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/auth",                    authRoutes);
app.use("/media",                   mediaRoutes);
app.use("/instructor/course",       instructorCourseRoutes);
app.use("/student/course",          studentViewCourseRoutes);
app.use("/student/order",           studentViewOrderRoutes);
app.use("/student/courses-bought",  studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/test-series",     studentTestSeriesRoutes);
app.use("/profile",                 profileRoutes);
app.use("/resource",                resourceRoutes); // ← ADD THIS

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
  });
}

module.exports = app;