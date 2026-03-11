import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminStyles from "./admin/AdminStyles.js"; // This MUST be exactly "./AdminStyles.js"

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, reports: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminStyles.AdminContainer>
      <AdminStyles.Sidebar>
        <h2>IIT KGB Mumbai</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px 0' }}>Dashboard</li>
            <li style={{ padding: '10px 0' }}>Manage Users</li>
            <li style={{ padding: '10px 0' }}>Settings</li>
          </ul>
        </nav>
      </AdminStyles.Sidebar>

      <AdminStyles.MainContent>
        <h1>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <AdminStyles.StatCard>
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </AdminStyles.StatCard>
          
          <AdminStyles.StatCard>
            <h3>Active Reports</h3>
            <p>{stats.reports}</p>
          </AdminStyles.StatCard>
        </div>
      </AdminStyles.MainContent>
    </AdminStyles.AdminContainer>
  );
};

export default AdminPanel;