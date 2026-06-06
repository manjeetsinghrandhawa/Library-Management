const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getAllUsers,
  deleteUser,
} = require("./user.controller");

const {
  auth,
  isAdmin,
} = require("../middleware/auth");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Admin Routes
router.get(
  "/getAllUsers",
  auth,
  isAdmin,
  getAllUsers
);

router.delete(
  "/deleteUser/:id",
  auth,
  isAdmin,
  deleteUser
);

module.exports = router;