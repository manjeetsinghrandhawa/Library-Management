/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiRotateCcw,
} from "react-icons/fi";
import { FiX } from "react-icons/fi";

import API from "../../services/api";

function BorrowBooks() {

    const [page, setPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);

const [sort, setSort] =
  useState("newest");
  const [borrows, setBorrows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedBook, setSelectedBook] =
    useState(null);

  useEffect(() => {
  fetchBorrowHistory();
}, [page, sort]);

  const fetchBorrowHistory =
    async () => {
      try {
        const response =
  await API.get(
    `/borrow/getBorrowHistory/history?page=${page}&limit=8&sort=${sort}`
  );

        setBorrows(
          response.data.history || []
        );
        setTotalPages(
  response.data.totalPages || 1
);
      } catch (error) {
        toast.error(
          "Failed to load borrowed books"
        );
      } finally {
        setLoading(false);
      }
    };

  const returnBookHandler =
    async (borrowId) => {
      try {
        const response =
          await API.put(
            `/borrow/returnBook/${borrowId}`
          );

        toast.success(
          response.data.message
        );

        fetchBorrowHistory();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to return book"
        );
      }
    };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading borrowed books...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">

        <span className="uppercase tracking-wider text-sm">
          Borrowed Collection
        </span>

        <h1 className="text-4xl font-bold mt-2">
          My Borrowed Books
        </h1>

        <p className="mt-3">
          Track all your borrowed books,
          due dates and return status.
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">

  <div className="flex justify-end">

    <select
      value={sort}
      onChange={(e) => {
        setPage(1);
        setSort(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-700"
    >
      <option value="newest">
        Newest First
      </option>

      <option value="oldest">
        Oldest First
      </option>

      <option value="fine">
        Highest Fine
      </option>
    </select>

  </div>

</div>

      {/* Count */}

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-slate-800">
          Borrow History
        </h2>

        <div className="px-4 py-2 rounded-full bg-white shadow border text-slate-700">
          {borrows.length} Books
        </div>

      </div>

      {/* Empty State */}

      {borrows.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border p-16 text-center">

          <div className="text-7xl mb-4">
            📚
          </div>

          <h3 className="text-2xl font-semibold">
            No Borrowed Books
          </h3>

          <p className="text-slate-500 mt-2">
            Books you borrow will appear here.
          </p>

        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {borrows.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
            >

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mb-5">
                <FiBookOpen />
              </div>

              <h3 className="font-bold text-xl text-slate-800">
                {item.book?.title}
              </h3>

              <p className="text-slate-500 mt-2">
                {item.book?.author}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-600">

                <p>
                  <span className="font-medium">
                    Category:
                  </span>{" "}
                  {item.book?.category}
                </p>

                <p>
                  <span className="font-medium">
                    Due Date:
                  </span>{" "}
                  {new Date(
                    item.dueDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <span className="font-medium">
                    Fine:
                  </span>{" "}
                  ₹{item.fine}
                </p>

              </div>

              <div className="mt-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status ===
                    "BORROWED"
                      ? "bg-blue-100 text-blue-700"
                      : item.status ===
                        "OVERDUE"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-6 space-y-3">

                <button
                  onClick={() =>
                    setSelectedBook(item)
                  }
                  className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 transition"
                >
                  View Details
                </button>

                {(item.status ===
                  "BORROWED" ||
                  item.status ===
                    "OVERDUE") && (
                  <button
                    onClick={() =>
                      returnBookHandler(
                        item._id
                      )
                    }
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FiRotateCcw />
                    Return Book
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
      {totalPages > 1 && (

  <div className="flex justify-center items-center gap-3 mt-10">

    <button
      disabled={page === 1}
      onClick={() =>
        setPage(page - 1)
      }
      className={`px-4 py-2 rounded-xl font-medium ${
        page === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold">
      {page} / {totalPages}
    </div>

    <button
      disabled={
        page === totalPages
      }
      onClick={() =>
        setPage(page + 1)
      }
      className={`px-4 py-2 rounded-xl font-medium ${
        page === totalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>

)}

      {/* Details Modal */}

      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedBook(null)}>
            

          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl"
          onClick={(e) =>
    e.stopPropagation()}>
            

            <button
  onClick={() =>
    setSelectedBook(null)
  }
  className="
    absolute top-4 right-4
    w-12 h-12
    flex items-center justify-center
    rounded-full
    bg-slate-100
    hover:bg-red-100
    text-slate-700
    hover:text-red-600
    transition
  "
>
  <FiX size={28} />
</button>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl">
                <FiBookOpen />
              </div>

              <div>

                <h2 className="text-3xl font-bold text-slate-500">
                  {
                    selectedBook.book
                      ?.title
                  }
                </h2>

                <p className="text-slate-600 text-slate-500">
                  by{" "}
                  {
                    selectedBook.book
                      ?.author
                  }
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500">
                  Category
                </p>

                <p className="font-semibold text-slate-500">
                  {
                    selectedBook.book
                      ?.category
                  }
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="font-semibold text-slate-500">
                  {
                    selectedBook.status
                  }
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500">
                  Borrow Date
                </p>

                <p className="font-semibold text-slate-500">
                  {new Date(
                    selectedBook.borrowDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-sm text-slate-500">
                  Due Date
                </p>

                <p className="font-semibold text-slate-500">
                  {new Date(
                    selectedBook.dueDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl col-span-2">
                <p className="text-sm text-slate-500">
                  Fine
                </p>

                <p className="font-semibold text-amber-600 ">
                  ₹
                  {
                    selectedBook.fine
                  }
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default BorrowBooks;
