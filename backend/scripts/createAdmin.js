require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../config/database");

const User = require("../User/user.model");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin =
      await User.findOne({
        email: "admin@library.com",
      });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash("Admin@123", 10);

    await User.create({
      firstName: "Library",
      lastName: "Admin",
      email: "admin@library.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();