/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";

import {
  FiBookOpen,
  FiCalendar,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";

import { getIssuedBooks } from "../../services/adminApi";

function IssuedBooks() {

  const [search, setSearch] =
  useState("");

const [status, setStatus] =
  useState("");

const [sort, setSort] =
  useState("newest");

const [page, setPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);

  const [books, setBooks] =
    useState([]);

  useEffect(() => {
  fetchBooks();
}, [
  search,
  status,
  sort,
  page,
]);

  const fetchBooks =
  async () => {
    try {
      const response =
        await getIssuedBooks({
          search,
          status,
          sort,
          page,
          limit: 9,
        });

      setBooks(
        response.data.data
      );

      setTotalPages(
        response.data.totalPages
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Issued Books
          </h1>

          <p className="text-slate-500 mt-2">
            Track all currently borrowed and overdue books.
          </p>
        </div>

        <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow">
          <p className="text-sm">
            Active Borrows
          </p>

          <h2 className="text-2xl font-bold">
            {books.length}
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8">

  <div className="grid md:grid-cols-4 gap-4">

    <input
      type="text"
      placeholder="Search books or users..."
      value={search}
      onChange={(e) => {
        setPage(1);
        setSearch(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    />

    <select
      value={status}
      onChange={(e) => {
        setPage(1);
        setStatus(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    >
      <option value="">
        All Status
      </option>

      <option value="BORROWED">
        Borrowed
      </option>

      <option value="OVERDUE">
        Overdue
      </option>
    </select>

    <select
      value={sort}
      onChange={(e) => {
        setPage(1);
        setSort(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="dueDate">
        Due Date
      </option>

      <option value="daysLeft">
        Days Left
      </option>
    </select>

    <div className="bg-blue-50 rounded-xl flex items-center justify-center font-semibold text-blue-700">
      {books.length} Records
    </div>

  </div>

</div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 text-center">

          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">
              📚
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            No Books Issued
          </h2>

          <p className="text-slate-500">
            All books are currently available in the library.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {books.map((item) => {
            const overdue =
              item.daysLeft < 0;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6"
              >

                {/* Top */}
                <div className="flex justify-between items-start mb-5">

                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <FiBookOpen
                      className="text-blue-600"
                      size={24}
                    />
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      overdue
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {overdue
                      ? "OVERDUE"
                      : "BORROWED"}
                  </span>

                </div>

                {/* Book Details */}
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {item.book?.title}
                </h2>

                <p className="text-slate-500 mb-6">
                  {item.book?.author}
                </p>

                {/* User */}
                <div className="flex items-center gap-3 mb-4">

                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FiUser />
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">
                      {
                        item.user
                          ?.firstName
                      }{" "}
                      {
                        item.user
                          ?.lastName
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        item.user
                          ?.email
                      }
                    </p>
                  </div>

                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <FiCalendar />

                  <span>
                    Due:
                    {" "}
                    {new Date(
                      item.dueDate
                    ).toLocaleDateString()}
                  </span>
                </div>

                {/* Days Left */}
                <div
                  className={`rounded-2xl p-4 ${
                    overdue
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >

                  <div className="flex items-center gap-2 mb-1">

                    {overdue && (
                      <FiAlertTriangle className="text-red-500" />
                    )}

                    <span
                      className={`font-semibold ${
                        overdue
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {overdue
                        ? `${Math.abs(
                            item.daysLeft
                          )} days overdue`
                        : `${item.daysLeft} days remaining`}
                    </span>

                  </div>

                  <p className="text-sm text-slate-500">
                    {overdue
                      ? "This book should be returned immediately."
                      : "Borrow period is still active."}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-3 mt-10">

    <button
      disabled={page === 1}
      onClick={() =>
        setPage(page - 1)
      }
      className={`px-4 py-2 rounded-xl ${
        page === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold">
      {page} / {totalPages}
    </div>

    <button
      disabled={
        page === totalPages
      }
      onClick={() =>
        setPage(page + 1)
      }
      className={`px-4 py-2 rounded-xl ${
        page === totalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>
)}

    </div>
  );
}

export default IssuedBooks;