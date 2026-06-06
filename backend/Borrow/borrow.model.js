const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
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

    borrowDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    fine: {
  type: Number,
  default: 0,
},

finePaid: {
  type: Boolean,
  default: false,
},

    status: {
      type: String,
      enum: [
        "BORROWED",
        "RETURNED",
        "OVERDUE",
      ],
      default: "BORROWED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Borrow",
  borrowSchema
);