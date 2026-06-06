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
  const [books, setBooks] =
    useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks =
    async () => {
      try {
        const response =
          await getIssuedBooks();

        setBooks(
          response.data.data
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

    </div>
  );
}

export default IssuedBooks;