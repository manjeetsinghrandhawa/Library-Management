require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const updateFines = require(
  "./cron/fineCron"
);

const connectDB = require("./config/database");

const userRoutes = require("./User/user.router");
const bookRoutes = require("./Book/book.router");
const borrowRoutes = require("./Borrow/borrow.router");

const app = express();

connectDB();
updateFines(); // Start the fine update cron job

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management API Running",
  });
});

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/borrow", borrowRoutes);
// 404 Route
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});