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
  const [requests, setRequests] =
    useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests =
    async () => {
      const response =
        await getAllRequests();

      setRequests(
        response.data.requests
      );
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

    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-800">
        Borrow Requests
      </h1>

      <p className="text-slate-500 mt-2">
        Review and manage book borrowing requests.
      </p>
    </div>

    {requests.length === 0 ? (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <span className="text-5xl">
            🎉
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          No Pending Requests
        </h2>

        <p className="text-slate-500 max-w-md mx-auto">
          Great job! There are currently no borrow requests waiting
          for approval. Everything is up to date.
        </p>

      </div>
    ) : (
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
    )}

  </div>
);
}

export default BorrowRequests;