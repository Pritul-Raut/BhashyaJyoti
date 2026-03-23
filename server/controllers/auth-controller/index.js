const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { updateLoginStreak } = require("../profile-controller");

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // 1. Validation Check: Ensure all fields exist
    if (!userName || !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide user name, email, and password",
      });
    }

    // 2. Check if user already exists (username OR email)
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or User email already exists",
      });
    }

    // 3. Hash the Password
    const hashPassword = await bcrypt.hash(password, 10);

    // 4. Create the User
    const newUser = new User({
      userName,
      userEmail,
      role: role || "user",
      password: hashPassword,
      purchasedItems: [],
      organizationMemberships: [],
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      userId: newUser._id,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ── NEW: Update login streak on every successful login ──
    await updateLoginStreak(checkUser._id);

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      "JWT_SECRET", // In production, use process.env.JWT_SECRET
      { expiresIn: "120m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { registerUser, loginUser };