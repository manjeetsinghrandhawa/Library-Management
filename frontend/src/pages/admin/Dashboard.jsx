/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

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

  return (
    <div className="dashboard-page">
      <h1>
        Library Dashboard
      </h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h2>
            {stats.totalBooks || 0}
          </h2>
          <p>Total Books</p>
        </div>

        <div className="metric-card">
          <h2>
            {stats.totalUsers || 0}
          </h2>
          <p>Total Users</p>
        </div>

        <div className="metric-card">
          <h2>
            {stats.activeBorrows || 0}
          </h2>
          <p>Issued Books</p>
        </div>

        <div className="metric-card">
          <h2>
            {stats.overdueBooks || 0}
          </h2>
          <p>Overdue Books</p>
        </div>

        <div className="metric-card">
          <h2>
            ₹
            {stats.totalPendingFine ||
              0}
          </h2>
          <p>Pending Fine</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;