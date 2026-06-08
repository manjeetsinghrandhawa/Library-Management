const express = require("express");

const router = express.Router();

const {
  borrowBook,
  returnBook,
  getBorrowHistory,
  getIssuedBooks,
  getOverdueBooks,
  getUserBorrowHistory,
  getDashboardStatsForAdmin,
    requestBook,
    getMyRequests,
    getAllRequests,
    approveRequest,
    rejectRequest
} = require("./borrow.controller");

const {
  auth,
  isStudent,
    isAdmin,
} = require("../middleware/auth");

// router.post(
//   "/borrowBook/:bookId",
//   auth,
//   isStudent,
//   borrowBook
// );

router.put(
  "/returnBook/:borrowId",
  auth,
  isStudent,
  returnBook
);

router.get(
  "/getBorrowHistory/history",
  auth,
  isStudent,
  getBorrowHistory
);

router.post(
  "/requestBook/:bookId",
  auth,
  isStudent,
  requestBook
);

router.get(
  "/myRequests",
  auth,
  isStudent,
  getMyRequests
);


router.get(
  "/getIssuedBooks",
  auth,
  isAdmin,
  getIssuedBooks
);

router.get(
  "/getOverdueBooks",
  auth,
  isAdmin,
  getOverdueBooks
);

router.get(
  "/getUserBorrowHistory/:userId",
  auth,
  isAdmin,
  getUserBorrowHistory
);

router.get(
  "/getDashboardStatsForAdmin",
  auth,
  isAdmin,
  getDashboardStatsForAdmin
);

router.get(
  "/getAllRequests",
  auth,
  isAdmin,
  getAllRequests
);

router.put(
  "/approveRequest/:requestId",
  auth,
  isAdmin,
  approveRequest
);

router.put(
  "/rejectRequest/:requestId",
  auth,
  isAdmin,
  rejectRequest
);
module.exports = router;