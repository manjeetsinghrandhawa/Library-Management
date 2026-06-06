const Book = require("./book.model");

exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      totalCopies,
      availableCopies,
    } = req.body;

    if (
      !title ||
      !author ||
      !isbn ||
      !category ||
      !totalCopies
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingBook =
      await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message:
          "Book with this ISBN already exists",
      });
    }

    const totalCopiesNum = Number(totalCopies);
    const availableCopiesNum = Number(availableCopies);

    if (
      availableCopiesNum > totalCopiesNum
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies cannot exceed total copies",
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      description,
      publishedYear: Number(publishedYear),
  totalCopies: totalCopiesNum,
  availableCopies:
    availableCopiesNum || totalCopiesNum,
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add book",
    });
  }
};

exports.getSingleBook = async (
  req,
  res
) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};


exports.getAllBooks = async (req, res) => {
  try {
    const {
      search = "",
      category,
      available,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
        {
          isbn: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category Filter
    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    // Available Books Filter
    if (available === "true") {
      query.availableCopies = {
        $gt: 0,
      };
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "title":
        sortOption = {
          title: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const skip =
      (currentPage - 1) * pageLimit;

    const totalBooks =
      await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,

      totalBooks,

      currentPage,

      totalPages: Math.ceil(
        totalBooks / pageLimit
      ),

      books,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book =
      await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedYear,
      totalCopies,
      availableCopies,
    } = req.body;

    if (isbn && isbn !== book.isbn) {
      const existingBook =
        await Book.findOne({ isbn });

      if (existingBook) {
        return res.status(400).json({
          success: false,
          message:
            "ISBN already exists",
        });
      }
    }

    const updatedTotalCopies =
      totalCopies ??
      book.totalCopies;

    const updatedAvailableCopies =
      availableCopies ??
      book.availableCopies;

    if (
      updatedAvailableCopies >
      updatedTotalCopies
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies cannot exceed total copies",
      });
    }

    const updatedBook =
      await Book.findByIdAndUpdate(
        id,
        {
          title,
          author,
          isbn,
          category,
          description,
          publishedYear,
          totalCopies,
          availableCopies,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book =
      await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Book deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};