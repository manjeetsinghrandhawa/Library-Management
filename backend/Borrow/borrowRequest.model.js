const mongoose = require("mongoose");

const borrowRequestSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ],
        default: "PENDING",
      },

      adminRemark: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "BorrowRequest",
  borrowRequestSchema
);