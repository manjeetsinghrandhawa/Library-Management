/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  FaBook,
  FaUsers,
  FaBookReader,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  getDashboardStatsForAdmin,
} from "../../services/adminApi";

function Dashboard() {
  const [stats, setStats] =
    useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats =
    async () => {
      try {
        const response =
          await getDashboardStatsForAdmin();

        setStats(
          response.data.stats
        );
      } catch (error) {
        console.log(error);
      }
    };

  const chartData = [
    {
      name: "Books",
      value:
        stats.totalBooks || 0,
    },
    {
      name: "Users",
      value:
        stats.totalUsers || 0,
    },
    {
      name: "Issued",
      value:
        stats.activeBorrows || 0,
    },
    {
      name: "Overdue",
      value:
        stats.overdueBooks || 0,
    },
  ];

  const COLORS = [
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EF4444",
  ];

  const cards = [
    {
      title: "Total Books",
      value:
        stats.totalBooks || 0,
      icon: <FaBook />,
      color:
        "from-emerald-500 to-teal-600",
    },
    {
      title: "Total Users",
      value:
        stats.totalUsers || 0,
      icon: <FaUsers />,
      color:
        "from-blue-500 to-cyan-600",
    },
    {
      title: "Issued Books",
      value:
        stats.activeBorrows ||
        0,
      icon: <FaBookReader />,
      color:
        "from-purple-500 to-indigo-600",
    },
    {
      title: "Overdue Books",
      value:
        stats.overdueBooks || 0,
      icon: (
        <FaExclamationTriangle />
      ),
      color:
        "from-red-500 to-rose-600",
    },
    {
      title: "Pending Fine",
      value: `₹${
        stats.totalPendingFine ||
        0
      }`,
      icon: (
        <FaMoneyBillWave />
      ),
      color:
        "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Hero */}

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">

        <span className="uppercase tracking-wider text-sm text-emerald-100">
          Admin Dashboard
        </span>

        <h1 className="text-4xl font-bold mt-2">
          Library Overview 📚
        </h1>

        <p className="mt-3 text-emerald-100">
          Monitor books, users,
          borrow activity, overdue
          books and pending fines.
        </p>

      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        {cards.map(
          (card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white text-2xl mb-4`}
              >
                {card.icon}
              </div>

              <h2 className="text-3xl font-bold text-slate-800 mt-5 mb-2">
                {card.value}
              </h2>

              <p className="text-slate-500 mt-1">
                {card.title}
              </p>
            </div>
          )
        )}

      </div>

      {/* Chart Section */}

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Library Statistics
            </h2>

            <p className="text-slate-500 mt-1">
              Distribution of books,
              users and borrowing
              activity.
            </p>

          </div>

        </div>

        <div className="h-[450px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={160}
                innerRadius={90}
                paddingAngle={4}
                label
              >
                {chartData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;