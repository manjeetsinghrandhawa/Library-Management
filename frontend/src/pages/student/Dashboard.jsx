/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";

function Dashboard() {

    // Requests

const [
  requestPage,
  setRequestPage,
] = useState(1);

const [
  requestTotalPages,
  setRequestTotalPages,
] = useState(1);

const [
  requestStatus,
  setRequestStatus,
] = useState("");

const [
  requestSort,
  setRequestSort,
] = useState("newest");

// History

const [
  historyPage,
  setHistoryPage,
] = useState(1);

const [
  historyTotalPages,
  setHistoryTotalPages,
] = useState(1);

const [
  historyStatus,
  setHistoryStatus,
] = useState("");

const [
  historySort,
  setHistorySort,
] = useState("newest");
  const navigate = useNavigate();

  const [history, setHistory] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
  fetchData();
}, [
  requestPage,
  requestStatus,
  requestSort,
  historyPage,
  historyStatus,
  historySort,
]);

  const fetchData =
  async () => {
    try {
      const [
        historyRes,
        requestRes,
      ] = await Promise.all([
        API.get(
          `/borrow/getBorrowHistory/history?page=${historyPage}&limit=5&status=${historyStatus}&sort=${historySort}`
        ),

        API.get(
          `/borrow/myRequests?page=${requestPage}&limit=5&status=${requestStatus}&sort=${requestSort}`
        ),
      ]);

      setHistory(
        historyRes.data.history ||
          []
      );

      setRequests(
        requestRes.data.requests ||
          []
      );

      setHistoryTotalPages(
        historyRes.data
          .totalPages || 1
      );

      setRequestTotalPages(
        requestRes.data
          .totalPages || 1
      );
    } catch (error) {
      toast.error(
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
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

        fetchData();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to return book"
        );
      }
    };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const activeBooks =
    history.filter(
      (book) =>
        book.status === "BORROWED"
    );

  const overdueBooks =
    history.filter(
      (book) =>
        book.status === "OVERDUE"
    );

  const returnedBooks =
    history.filter(
      (book) =>
        book.status === "RETURNED"
    );

  const totalFine =
    history.reduce(
      (sum, item) =>
        sum + item.fine,
      0
    );

  return (
  <div className="space-y-8">

    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">

      <span className="uppercase tracking-wider text-sm text-white font-medium">
        Student Dashboard
      </span>

      <h1 className="text-4xl font-bold mt-2">
        Welcome Back 👋
      </h1>

      <p className="mt-3 text-emerald-100">
        Track your borrowed books, requests, due dates and fines in one place.
      </p>

    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-slate-700 text-sm font-medium">
          Active Books
        </p>

        <h2 className="text-4xl font-bold text-emerald-600 mt-2">
          {activeBooks.length}
        </h2>

        <p className="text-sm text-slate-700 mt-2">
          Currently borrowed
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm">
          Returned Books
        </p>

        <h2 className="text-4xl font-bold text-blue-600 mt-2">
          {returnedBooks.length}
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Successfully returned
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm">
          Overdue Books
        </p>

        <h2 className="text-4xl font-bold text-red-600 mt-2">
          {overdueBooks.length}
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Need attention
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm">
          Total Fine
        </p>

        <h2 className="text-4xl font-bold text-amber-600 mt-2">
          ₹{totalFine}
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Outstanding amount
        </p>
      </div>

    </div>

    {/* Borrow Requests */}
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

      <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  <h2 className="text-xl font-semibold text-slate-500">
    My Borrow Requests
  </h2>

  <div className="flex gap-3 flex-wrap">

    <select
      value={requestStatus}
      onChange={(e) => {
        setRequestPage(1);
        setRequestStatus(
          e.target.value
        );
      }}
      className="border rounded-xl px-4 py-2 text-slate-500"
    >
      <option value="">
        All Status
      </option>

      <option value="PENDING">
        Pending
      </option>

      <option value="APPROVED">
        Approved
      </option>

      <option value="REJECTED">
        Rejected
      </option>

    </select>

    <select
      value={requestSort}
      onChange={(e) => {
        setRequestPage(1);
        setRequestSort(
          e.target.value
        );
      }}
      className="border rounded-xl px-4 py-2 text-slate-500"
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

    </select>

  </div>

</div>

      {requests.length === 0 ? (
        <div className="p-12 text-center">

          <div className="text-6xl mb-4">
            📚
          </div>

          <h3 className="text-xl font-semibold text-slate-900">
            No Requests Yet
          </h3>

          <p className="text-slate-700 mt-2">
            Your borrow requests will appear here.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-500">
                  Book
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Author
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-t"
                >
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {request.book?.title}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {request.book?.author}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : request.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.status}
                    </span>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>

    {requestTotalPages > 1 && (

  <div className="flex justify-center items-center gap-3 p-6">

    <button
      disabled={
        requestPage === 1
      }
      onClick={() =>
        setRequestPage(
          requestPage - 1
        )
      }
      className={`px-4 py-2 rounded-xl ${
        requestPage === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold">
      {requestPage} /{" "}
      {requestTotalPages}
    </div>

    <button
      disabled={
        requestPage ===
        requestTotalPages
      }
      onClick={() =>
        setRequestPage(
          requestPage + 1
        )
      }
      className={`px-4 py-2 rounded-xl ${
        requestPage ===
        requestTotalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>

)}

    {/* Borrow History */}
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

      <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  <h2 className="text-xl font-semibold text-slate-500">
    Borrow History
  </h2>

  <div className="flex gap-3 flex-wrap">

    <select
      value={historyStatus}
      onChange={(e) => {
        setHistoryPage(1);
        setHistoryStatus(
          e.target.value
        );
      }}
      className="border rounded-xl px-4 py-2 text-slate-500"
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

      <option value="RETURNED">
        Returned
      </option>

    </select>

    <select
      value={historySort}
      onChange={(e) => {
        setHistoryPage(1);
        setHistorySort(
          e.target.value
        );
      }}
      className="border rounded-xl px-4 py-2 text-slate-500"
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="fine">
        Highest Fine
      </option>

    </select>

  </div>

</div>

{historyTotalPages > 1 && (

  <div className="flex justify-center items-center gap-3 p-6">

    <button
      disabled={
        historyPage === 1
      }
      onClick={() =>
        setHistoryPage(
          historyPage - 1
        )
      }
      className={`px-4 py-2 rounded-xl ${
        historyPage === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold">
      {historyPage} /{" "}
      {historyTotalPages}
    </div>

    <button
      disabled={
        historyPage ===
        historyTotalPages
      }
      onClick={() =>
        setHistoryPage(
          historyPage + 1
        )
      }
      className={`px-4 py-2 rounded-xl ${
        historyPage ===
        historyTotalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>

)}

      {history.length === 0 ? (
        <div className="p-12 text-center">

          <div className="text-6xl mb-4">
            📖
          </div>

          <h3 className="text-xl font-semibold text-slate-700">
            No Borrow History
          </h3>

          <p className="text-slate-500 mt-2">
            Borrowed books will appear here.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-500">
                  Book
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Borrow Date
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Due Date
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Fine
                </th>

                <th className="px-6 py-4 text-left text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {history.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {item.book?.title}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "BORROWED"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "OVERDUE"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(
                      item.borrowDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(
                      item.dueDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-medium text-amber-600">
                    ₹{item.fine}
                  </td>

                  <td className="px-6 py-4">

                    {item.status ===
                      "BORROWED" && (
                      <button
                        onClick={() =>
                          returnBookHandler(
                            item._id
                          )
                        }
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
                      >
                        Return Book
                      </button>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>

  </div>
);
}

export default Dashboard;