/* eslint-disable no-unused-vars */
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FiActivity,
  FiBookOpen,
  FiBookmark,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";

import toast from "react-hot-toast";

function StudentLayout() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-slate-100">

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col justify-between p-6">

        <div>

          <div className="mb-10">
            <span className="text-sm uppercase tracking-wider text-emerald-400">
              Student Panel
            </span>

            <h2 className="text-2xl font-bold mt-2">
              Reading Workspace
            </h2>

            <p className="text-slate-400 text-sm mt-3">
              Discover books, manage requests, and track your borrowing history.
            </p>
          </div>

          <div className="space-y-3">

            <NavLink
              to="/student"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <FiActivity size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/student/books"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <FiBookOpen size={20} />
              <span>Books</span>
            </NavLink>

            {/* <NavLink
              to="/student/saved-books"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <FiBookmark size={20} />
              <span>Saved Books</span>
            </NavLink> */}

            <NavLink
              to="/student/history"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-emerald-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <FiCalendar size={20} />
              <span>Borrow History</span>
            </NavLink>

          </div>

        </div>

        {/* Footer */}
        <div>

          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition"
          >
            <FiLogOut />
            Logout
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Library Management System
          </p>

        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}

export default StudentLayout;