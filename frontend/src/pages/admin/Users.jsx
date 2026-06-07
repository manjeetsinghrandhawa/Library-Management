/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  deleteUser,
  getUserBorrowHistory,
} from "../../services/adminApi";

function Users() {

  const [search, setSearch] =
  useState("");

const [sort, setSort] =
  useState("newest");

const [page, setPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchUsers();
}, [
  search,
  sort,
  page,
]);

  const fetchUsers = async () => {
  try {
    setLoading(true);

    const response =
      await getAllUsers({
        search,
        sort,
        page,
        limit: 10,
      });

    setUsers(
      response.data.users || []
    );

    setTotalPages(
      response.data.totalPages ||
        1
    );
  } catch (error) {
    toast.error(
      "Failed to fetch users"
    );
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      toast.success("User deleted successfully");

      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const viewHistory = async (id) => {
    try {
      const response =
        await getUserBorrowHistory(id);

      setHistory(response.data);
    } catch (error) {
      toast.error(
        "Failed to fetch borrow history"
      );
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage students and view their borrowing activity.
          </p>
        </div>

        <div className="bg-indigo-600 text-white px-5 py-3 rounded-xl">
          Students: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">

  <div className="grid md:grid-cols-2 gap-4 mb-4 text-slate-500">

    <input
    className="w-full border p-3 rounded text-slate-500"
      type="text"
      placeholder="Search student name or email..."
      value={search}
      onChange={(e) => {
        setPage(1);

        setSearch(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-500"
    />

    <select
      value={sort}
      onChange={(e) => {
        setPage(1);

        setSort(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-500"
    >
      <option value="newest">
        Newest First
      </option>

      <option value="oldest">
        Oldest First
      </option>

      <option value="name">
        Name A-Z
      </option>
    </select>

  </div>

</div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="p-8 text-center">
            Loading users...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="text-left p-4 text-slate-600">
                  Name
                </th>

                <th className="text-left p-4 text-slate-600">
                  Email
                </th>

                <th className="text-left p-4 text-slate-600">
                  Role
                </th>

                <th className="text-center p-4 text-slate-600">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t"
                >
                  <td className="p-4 text-slate-500">
                    {user.firstName}{" "}
                    {user.lastName}
                  </td>

                  <td className="p-4 text-slate-500">
                    {user.email}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          viewHistory(
                            user._id
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        History
                      </button>

                      {user.role !==
                        "ADMIN" && (
                        <button
                          onClick={() =>
                            handleDelete(
                              user._id
                            )
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-4 mt-8">

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

    <div className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold">
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

      {/* History Modal */}

      {history && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">

    <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

      {/* Header */}

      <div className="flex justify-between items-center px-8 py-6 border-b">

        <div>
          <h2 className="text-3xl font-bold text-slate-500">
            {history.user.firstName}{" "}
            {history.user.lastName}
          </h2>

          <p className="text-slate-500 mt-1">
            Student Borrowing Details
          </p>
        </div>

        <button
          onClick={() => setHistory(null)}
          className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-2xl flex items-center justify-center transition"
        >
          ✕
        </button>

      </div>

      <div className="p-8">

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">

            <h3 className="text-4xl font-bold text-blue-700">
              {history.totalBorrowedBooks}
            </h3>

            <p className="mt-2 font-medium text-slate-500">
              Total Borrowed Books
            </p>

          </div>

          <div className="bg-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-sm">

            <h3 className="text-4xl font-bold text-emerald-700">
              {history.activeBooksCount}
            </h3>

            <p className="mt-2 font-medium text-slate-500">
              Active Books
            </p>

          </div>

          <div className="bg-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">

            <h3 className="text-4xl font-bold text-red-700">
              ₹{history.totalFine}
            </h3>

            <p className="mt-2 font-medium text-slate-500">
              Total Fine
            </p>

          </div>

        </div>

        {/* Borrow History */}

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-2xl font-bold text-slate-500">
            Borrow History
          </h3>

          <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full font-medium">
            {history.borrowHistory?.length || 0} Records
          </span>

        </div>

        {history.borrowHistory?.length === 0 ? (

          <div className="bg-slate-50 border rounded-2xl p-12 text-center">

            <div className="text-6xl mb-4">
              📚
            </div>

            <h4 className="text-xl font-semibold text-slate-500">
              No Borrow History Found
            </h4>

            <p className="text-slate-500 mt-2">
              This student has not borrowed any books yet.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {history.borrowHistory?.map(
              (borrow) => (
                <div
                  key={borrow._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h4 className="text-xl font-bold text-slate-500">
                        {borrow.book?.title}
                      </h4>

                      <p className="mt-2 text-slate-500">
                        <span className="font-semibold">
                          Author:
                        </span>{" "}
                        {borrow.book?.author}
                      </p>

                      <p className="text-slate-500">
                        <span className="font-semibold">
                          ISBN:
                        </span>{" "}
                        {borrow.book?.isbn}
                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        borrow.status ===
                        "BORROWED"
                          ? "bg-blue-100 text-blue-700"
                          : borrow.status ===
                            "OVERDUE"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {borrow.status}
                    </span>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    <div className="bg-slate-50 rounded-xl p-4">

                      <p className="text-sm text-slate-500">
                        Fine
                      </p>

                      <p className="font-bold text-lg text-amber-600">
                        ₹{borrow.fine}
                      </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                      <p className="text-sm text-slate-500">
                        Borrow ID
                      </p>

                      <p className="font-medium text-slate-500 break-all">
                        {borrow._id}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

    </div>

  </div>
)}

    </div>
  );
}

export default Users;