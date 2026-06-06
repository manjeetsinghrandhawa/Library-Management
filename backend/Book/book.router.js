const express = require("express");

const router = express.Router();

const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
} = require("./book.controller");

const {
  auth,
  isAdmin,
} = require("../middleware/auth");

router.get("/getAllBooks/", getAllBooks);

router.get("/getSingleBook/:id", getSingleBook);

router.post(
  "/addBook",
  auth,
  isAdmin,
  addBook
);

router.put(
  "/:id",
  auth,
  isAdmin,
  updateBook
);

router.delete(
  "/:id",
  auth,
  isAdmin,
  deleteBook
);

module.exports = router;