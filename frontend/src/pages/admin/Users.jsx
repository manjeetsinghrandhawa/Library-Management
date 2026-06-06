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
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
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
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage students and view their borrowing activity.
          </p>
        </div>

        <div className="bg-indigo-600 text-white px-5 py-3 rounded-xl">
          Total Users: {users.length}
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
                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  Role
                </th>

                <th className="text-center p-4">
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
                  <td className="p-4">
                    {user.firstName}{" "}
                    {user.lastName}
                  </td>

                  <td className="p-4">
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

      {/* History Modal */}

      {history && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white w-[90%] max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {history.user.firstName}{" "}
                {history.user.lastName}
              </h2>

              <button
                onClick={() =>
                  setHistory(null)
                }
                className="text-red-500 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold">
                  {
                    history.totalBorrowedBooks
                  }
                </h3>
                <p>Total Borrowed</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold">
                  {
                    history.activeBooksCount
                  }
                </h3>
                <p>Active Books</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold">
                  ₹
                  {history.totalFine}
                </h3>
                <p>Total Fine</p>
              </div>

            </div>

            <h3 className="text-lg font-semibold mb-4">
              Borrow History
            </h3>

            <div className="space-y-3">

              {history.borrowHistory
                ?.length === 0 ? (
                <p>
                  No borrowing history
                  found.
                </p>
              ) : (
                history.borrowHistory?.map(
                  (borrow) => (
                    <div
                      key={
                        borrow._id
                      }
                      className="border rounded-lg p-4"
                    >
                      <h4 className="font-semibold">
                        {
                          borrow.book
                            ?.title
                        }
                      </h4>

                      <p>
                        Author:{" "}
                        {
                          borrow.book
                            ?.author
                        }
                      </p>

                      <p>
                        ISBN:{" "}
                        {
                          borrow.book
                            ?.isbn
                        }
                      </p>

                      <p>
                        Status:{" "}
                        {borrow.status}
                      </p>

                      <p>
                        Fine: ₹
                        {
                          borrow.fine
                        }
                      </p>
                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Users;