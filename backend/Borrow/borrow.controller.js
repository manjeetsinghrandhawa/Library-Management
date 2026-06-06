const Book = require("../Book/book.model");

const Borrow = require("./borrow.model");
const BorrowRequest = require("./borrowRequest.model");
const User = require("../User/user.model");

exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const userId = req.user._id;

    const book = await Book.findById(
      bookId
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Book currently unavailable",
      });
    }

    const existingBorrow =
      await Borrow.findOne({
        user: userId,
        book: bookId,
        status: "BORROWED",
      });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message:
          "You already borrowed this book",
      });
    }

    const borrowDate = new Date();

    const dueDate = new Date();

    dueDate.setDate(
      dueDate.getDate() + 14
    );

    const borrow =
      await Borrow.create({
        user: userId,
        book: bookId,
        borrowDate,
        dueDate,
      });

    book.availableCopies -= 1;

    await book.save();

    return res.status(201).json({
      success: true,
      message:
        "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to borrow book",
    });
  }
};

exports.returnBook = async (
  req,
  res
) => {
  try {
    const { borrowId } = req.params;

    const borrow =
      await Borrow.findById(
        borrowId
      ).populate("book");

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message:
          "Borrow record not found",
      });
    }

    if (
      borrow.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized action",
      });
    }

    if (
      borrow.status === "RETURNED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Book already returned",
      });
    }

    const returnDate =
      new Date();

    let fine = 0;

    if (
      returnDate > borrow.dueDate
    ) {
      const lateDays =
        Math.ceil(
          (returnDate -
            borrow.dueDate) /
            (1000 *
              60 *
              60 *
              24)
        );

      fine = lateDays * 10;
    }

    borrow.returnDate =
      returnDate;

    borrow.fine = fine;

    borrow.status =
      "RETURNED";

    await borrow.save();

    const book =
      await Book.findById(
        borrow.book._id
      );

    book.availableCopies += 1;

    await book.save();

    return res.status(200).json({
      success: true,
      message:
        "Book returned successfully",
      fine,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to return book",
    });
  }
};

exports.getBorrowHistory =
  async (req, res) => {
    try {
      const history =
        await Borrow.find({
          user: req.user._id,
        })
          .populate(
            "book",
            "title author category"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count:
          history.length,
        history,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch history",
      });
    }
  };

  exports.getIssuedBooks =
  async (req, res) => {
    try {
      const borrows =
        await Borrow.find({
          status: {
            $in: [
              "BORROWED",
              "OVERDUE",
            ],
          },
        })
          .populate(
            "user",
            "firstName lastName email"
          )
          .populate(
            "book",
            "title author"
          );

      const data =
        borrows.map(
          (borrow) => {
            const daysLeft =
              Math.ceil(
                (borrow.dueDate -
                  new Date()) /
                  (1000 *
                    60 *
                    60 *
                    24)
              );

            return {
              ...borrow.toObject(),
              daysLeft,
            };
          }
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch issued books",
      });
    }
  };

  exports.getOverdueBooks =
  async (req, res) => {
    try {
      const books =
        await Borrow.find({
          status: "OVERDUE",
        })
          .populate(
            "user",
            "firstName lastName email"
          )
          .populate(
            "book",
            "title"
          );

      return res.status(200).json({
        success: true,
        books,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch overdue books",
      });
    }
  };

  exports.getUserBorrowHistory = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const borrowHistory =
      await Borrow.find({
        user: userId,
      })
        .populate(
          "book",
          "title author category isbn"
        )
        .sort({
          createdAt: -1,
        });

    const activeBooks =
      borrowHistory.filter(
        (borrow) =>
          borrow.status === "BORROWED" ||
          borrow.status === "OVERDUE"
      );

    const totalFine =
      borrowHistory.reduce(
        (sum, borrow) =>
          sum + borrow.fine,
        0
      );

    return res.status(200).json({
      success: true,
      user,
      totalBorrowedBooks:
        borrowHistory.length,
      activeBooksCount:
        activeBooks.length,
      totalFine,
      borrowHistory,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch user borrow history",
    });
  }
};

exports.getDashboardStatsForAdmin = async (
  req,
  res
) => {
  try {
     console.log(
      "Dashboard API Hit"
    );
    const [
      totalUsers,
      totalBooks,
      totalBorrows,
      activeBorrows,
      overdueBooks,
    ] = await Promise.all([
      User.countDocuments({
        role: "ADMIN",
      }),

      Book.countDocuments(),

      Borrow.countDocuments(),

      Borrow.countDocuments({
        status: "BORROWED",
      }),

      Borrow.countDocuments({
        status: "OVERDUE",
      }),
    ]);

    const fineAggregation =
      await Borrow.aggregate([
        {
          $group: {
            _id: null,
            totalFine: {
              $sum: "$fine",
            },
          },
        },
      ]);

    const totalPendingFine =
      fineAggregation.length > 0
        ? fineAggregation[0].totalFine
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,

        totalBooks,

        totalBorrows,

        activeBorrows,

        overdueBooks,

        totalPendingFine,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};

exports.requestBook =
  async (req, res) => {
    try {
      const { bookId } =
        req.params;

      const existing =
        await BorrowRequest.findOne({
          user: req.user._id,
          book: bookId,
          status: "PENDING",
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Request already pending",
        });
      }

      const request =
        await BorrowRequest.create({
          user: req.user._id,
          book: bookId,
        });

      return res.status(201).json({
        success: true,
        message:
          "Request submitted",
        request,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to request book",
      });
    }
  };

  exports.getMyRequests =
  async (req, res) => {
    try {
      const requests =
        await BorrowRequest.find({
          user: req.user._id,
        }).populate(
          "book",
          "title author"
        );

      return res.status(200).json({
        success: true,
        requests,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };

  exports.getAllRequests =
  async (req, res) => {
    try {
      const requests =
        await BorrowRequest.find()
          .populate(
            "user",
            "firstName lastName email"
          )
          .populate(
            "book",
            "title author"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        requests,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };

  exports.approveRequest =
  async (req, res) => {
    try {
      const { requestId } =
        req.params;

      const request =
        await BorrowRequest.findById(
          requestId
        );

      if (!request) {
        return res.status(404).json({
          success: false,
        });
      }

      const book =
        await Book.findById(
          request.book
        );

      if (
        book.availableCopies <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Book unavailable",
        });
      }

      const dueDate =
        new Date();

      dueDate.setDate(
        dueDate.getDate() + 14
      );

      await Borrow.create({
        user: request.user,
        book: request.book,
        dueDate,
      });

      book.availableCopies--;

      await book.save();

      request.status =
        "APPROVED";

      await request.save();

      return res.status(200).json({
        success: true,
        message:
          "Request approved",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };

exports.rejectRequest =
  async (req, res) => {
    try {
      const { requestId } =
        req.params;

      const request =
        await BorrowRequest.findById(
          requestId
        );

      request.status =
        "REJECTED";

      await request.save();

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };