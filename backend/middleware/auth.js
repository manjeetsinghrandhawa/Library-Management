const jwt = require("jsonwebtoken");
const User = require("../User/user.model");

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.replace(
        "Bearer ",
        ""
      );

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while validating token",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};