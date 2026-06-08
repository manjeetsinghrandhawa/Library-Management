const Book = require("../Book/book.model");

const Borrow = require("./borrow.model");
const BorrowRequest = require("./borrowRequest.model");
const User = require("../User/user.model");

// exports.borrowBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;

//     const userId = req.user._id;

//     const book = await Book.findById(
//       bookId
//     );

//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: "Book not found",
//       });
//     }

//     if (book.availableCopies <= 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Book currently unavailable",
//       });
//     }

//     const existingBorrow =
//       await Borrow.findOne({
//         user: userId,
//         book: bookId,
//         status: "BORROWED",
//       });

//     if (existingBorrow) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "You already borrowed this book",
//       });
//     }

//     const borrowDate = new Date();

//     const dueDate = new Date();

//     dueDate.setDate(
//       dueDate.getDate() + 14
//     );

//     const borrow =
//       await Borrow.create({
//         user: userId,
//         book: bookId,
//         borrowDate,
//         dueDate,
//       });

//     book.availableCopies -= 1;

//     await book.save();

//     return res.status(201).json({
//       success: true,
//       message:
//         "Book borrowed successfully",
//       borrow,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to borrow book",
//     });
//   }
// };

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

      if (
        borrow.fine === 0 &&
        returnDate >
          borrow.dueDate
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

        borrow.fine =
          lateDays * 10;
      }

      borrow.returnDate =
        returnDate;

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
        fine: borrow.fine,
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

exports.getBorrowHistory = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 8,
      sort = "newest",
    } = req.query;

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "fine":
        sortOption = {
          fine: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const currentPage =
      Number(page);

    const pageLimit =
      Number(limit);

    const skip =
      (currentPage - 1) *
      pageLimit;

    const totalBorrows =
      await Borrow.countDocuments({
        user: req.user._id,
      });

    const history =
      await Borrow.find({
        user: req.user._id,
      })
        .populate(
          "book",
          "title author category"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit);

    return res.status(200).json({
      success: true,

      totalBorrows,

      currentPage,

      totalPages: Math.ceil(
        totalBorrows /
          pageLimit
      ),

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

  exports.getIssuedBooks = async (req, res) => {
  try {
    const {
      search = "",
      status,
      page = 1,
      limit = 9,
      sort = "newest",
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const query = {
      status: {
        $in: ["BORROWED", "OVERDUE"],
      },
    };

    if (
      status &&
      ["BORROWED", "OVERDUE"].includes(status)
    ) {
      query.status = status;
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "dueDate":
        sortOption = {
          dueDate: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    let borrows = await Borrow.find(query)
      .populate(
        "user",
        "firstName lastName email"
      )
      .populate(
        "book",
        "title author"
      )
      .sort(sortOption);

    if (search) {
      const keyword =
        search.toLowerCase();

      borrows = borrows.filter(
        (borrow) =>
          borrow.book?.title
            ?.toLowerCase()
            .includes(keyword) ||
          borrow.book?.author
            ?.toLowerCase()
            .includes(keyword) ||
          borrow.user?.firstName
            ?.toLowerCase()
            .includes(keyword) ||
          borrow.user?.lastName
            ?.toLowerCase()
            .includes(keyword) ||
          borrow.user?.email
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    const data = borrows.map(
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

    if (sort === "daysLeft") {
      data.sort(
        (a, b) =>
          a.daysLeft - b.daysLeft
      );
    }

    const totalBooks = data.length;

    const paginatedData =
      data.slice(
        (currentPage - 1) * pageLimit,
        currentPage * pageLimit
      );

    return res.status(200).json({
      success: true,

      totalBooks,

      currentPage,

      totalPages: Math.ceil(
        totalBooks / pageLimit
      ),

      data: paginatedData,
    });
  } catch (error) {
    console.log(error);

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

      const existingBorrow =
  await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: {
      $in: [
        "BORROWED",
        "OVERDUE",
      ],
    },
  });

if (existingBorrow) {
  return res.status(400).json({
    success: false,
    message:
      "You already have this book",
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

  exports.getMyRequests = async (
  req,
  res
) => {
  try {
    const {
      status,
      search = "",
      page = 1,
      limit = 5,
      sort = "newest",
    } = req.query;

    const query = {
      user: req.user._id,
    };

    if (status) {
      query.status = status;
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const currentPage =
      Number(page);

    const pageLimit =
      Number(limit);

    const skip =
      (currentPage - 1) *
      pageLimit;

    const requests =
      await BorrowRequest.find(
        query
      )
        .populate(
          "book",
          "title author"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit);

    const totalRequests =
      await BorrowRequest.countDocuments(
        query
      );

    const filteredRequests =
      requests.filter(
        (request) =>
          request.book?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          request.book?.author
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    return res.status(200).json({
      success: true,
      requests:
        search
          ? filteredRequests
          : requests,

      totalRequests,

      currentPage,

      totalPages:
        Math.ceil(
          totalRequests /
            pageLimit
        ),
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
      const {
        search = "",
        status,
        page = 1,
        limit = 10,
        sort = "newest",
      } = req.query;

      const query = {};

      // Status Filter
      if (
        status &&
        [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ].includes(status)
      ) {
        query.status = status;
      }

      let sortOption = {};

      switch (sort) {
        case "oldest":
          sortOption = {
            createdAt: 1,
          };
          break;

        case "name":
          sortOption = {
            createdAt: -1,
          };
          break;

        default:
          sortOption = {
            createdAt: -1,
          };
      }

      let requests =
        await BorrowRequest.find(
          query
        )
          .populate(
            "user",
            "firstName lastName email"
          )
          .populate(
            "book",
            "title author"
          )
          .sort(sortOption);

      // Search
      if (search) {
        const keyword =
          search.toLowerCase();

        requests =
          requests.filter(
            (req) =>
              req.book?.title
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              req.book?.author
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              req.user?.firstName
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              req.user?.lastName
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              req.user?.email
                ?.toLowerCase()
                .includes(
                  keyword
                )
          );
      }

      if (sort === "name") {
        requests.sort((a, b) =>
          `${a.user?.firstName} ${a.user?.lastName}`.localeCompare(
            `${b.user?.firstName} ${b.user?.lastName}`
          )
        );
      }

      const currentPage =
        Number(page);

      const pageLimit =
        Number(limit);

      const totalRequests =
        requests.length;

      const paginatedRequests =
        requests.slice(
          (currentPage - 1) *
            pageLimit,
          currentPage *
            pageLimit
        );

      return res.status(200).json({
        success: true,

        totalRequests,

        currentPage,

        totalPages:
          Math.ceil(
            totalRequests /
              pageLimit
          ),

        requests:
          paginatedRequests,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch requests",
      });
    }
  };
  exports.approveRequest = async (
  req,
  res
) => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    const { requestId } =
      req.params;

    const request =
      await BorrowRequest.findById(
        requestId
      ).session(session);

    if (!request) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message:
          "Request not found",
      });
    }

    // Already processed
    if (
      request.status !==
      "PENDING"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Request already processed",
      });
    }

    const book =
      await Book.findById(
        request.book
      ).session(session);

    if (!book) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message:
          "Book not found",
      });
    }

    if (
      book.availableCopies <= 0
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Book unavailable",
      });
    }

    // Prevent duplicate active borrow
    const existingBorrow =
      await Borrow.findOne({
        user: request.user,
        book: request.book,
        status: {
          $in: [
            "BORROWED",
            "OVERDUE",
          ],
        },
      }).session(session);

    if (existingBorrow) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "User already has this book",
      });
    }

    const dueDate =
      new Date();

    dueDate.setDate(
      dueDate.getDate() + 14
    );

    await Borrow.create(
      [
        {
          user: request.user,
          book: request.book,
          dueDate,
        },
      ],
      { session }
    );

    book.availableCopies -= 1;

    await book.save({
      session,
    });

    request.status =
      "APPROVED";

    await request.save({
      session,
    });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message:
        "Request approved successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve request",
    });
  } finally {
    session.endSession();
  }
};

exports.rejectRequest = async (
  req,
  res
) => {
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
        message:
          "Request not found",
      });
    }

    // Prevent rejecting an already processed request
    if (
      request.status !==
      "PENDING"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Request already ${request.status.toLowerCase()}`,
      });
    }

    request.status =
      "REJECTED";

    await request.save();

    return res.status(200).json({
      success: true,
      message:
        "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject request",
    });
  }
};