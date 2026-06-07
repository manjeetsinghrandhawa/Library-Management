/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../../services/adminApi";

function BorrowRequests() {

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

  const [requests, setRequests] =
    useState([]);

  useEffect(() => {
  fetchRequests();
}, [
  search,
  status,
  sort,
  page,
]);

  const fetchRequests =
  async () => {
    try {
      const response =
        await getAllRequests({
          search,
          status,
          sort,
          page,
          limit: 8,
        });

      setRequests(
        response.data.requests
      );

      setTotalPages(
        response.data
          .totalPages || 1
      );
    } catch (error) {
      toast.error(
        "Failed to load requests"
      );
    }
  };

  const approve =
    async (id) => {
      await approveRequest(id);

      toast.success(
        "Request Approved"
      );

      fetchRequests();
    };

  const reject =
    async (id) => {
      await rejectRequest(id);

      toast.success(
        "Request Rejected"
      );

      fetchRequests();
    };

  return (
  <div className="max-w-7xl mx-auto">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Borrow Requests
        </h1>

        <p className="text-slate-500 mt-2">
          Review and manage book borrowing requests.
        </p>
      </div>

      <div className="bg-indigo-600 text-white px-5 py-3 rounded-xl shadow">
        Total Requests: {requests.length}
      </div>

    </div>

    {/* Filters */}
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">

      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="Search by book, author, student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border border-slate-300 rounded-xl px-4 py-3 text-slate-700"
        >
          <option value="">
            All Statuses
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
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border border-slate-300 rounded-xl px-4 py-3 text-slate-700"
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>
        </select>

      </div>

    </div>

    {/* Empty State */}
    {requests.length === 0 ? (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <span className="text-5xl">
            🎉
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          No Requests Found
        </h2>

        <p className="text-slate-500">
          No borrow requests match the selected filters.
        </p>

      </div>
    ) : (
      <>
        <div className="grid gap-5">

          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-xl font-semibold text-slate-800">
                    {req.book?.title}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    by {req.book?.author}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">

                    <p>
                      Requested By:
                      <span className="font-medium ml-2">
                        {req.user?.firstName}{" "}
                        {req.user?.lastName}
                      </span>
                    </p>

                    <p>
                      Email:
                      <span className="font-medium ml-2">
                        {req.user?.email}
                      </span>
                    </p>

                  </div>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    req.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>

              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      approve(req._id)
                    }
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      reject(req._id)
                    }
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-10">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage((prev) =>
                prev - 1
              )
            }
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-slate-200 cursor-not-allowed text-slate-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-slate-500"
            }`}
          >
            Previous
          </button>

          <span className="font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage((prev) =>
                prev + 1
              )
            }
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-slate-200 cursor-not-allowed text-slate-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-slate-500"
            }`}
          >
            Next
          </button>

        </div>
      </>
    )}

  </div>
);
}

export default BorrowRequests;