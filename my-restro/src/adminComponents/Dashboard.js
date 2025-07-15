// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './css/dashboard.css';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import DashboardCharts from './DashboardCharts';
import { FiShoppingCart, FiUsers, FiDollarSign, FiStar } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData,setDashboardData]=useState({
    orders: 0,
    users: 0,
    sales: 0,
    special: "N/A",
    deliverPercent:0,
    pendingPercent:0,
    cancelledPercent:0
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Trigger chart resize when sidebar toggles
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3001/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };
  fetchData();
  }, [sidebarOpen]);

  const stats = [
    { title: "Total Orders", value: dashboardData.orders, icon: <FiShoppingCart />, trend: "↑ 12%", color: "#4e73df" },
    { title: "Total Users", value: dashboardData.users, icon: <FiUsers />, trend: "↑ 5%", color: "#1cc88a" },
    { title: "Total Sales", value: dashboardData.sales.toFixed(2), icon: <FiDollarSign />, trend: "↑ 8%", color: "#36b9cc" },
    { title: "Today's Special", value: dashboardData.special.name, icon: <FiStar />, trend: "🔥 Popular", color: "#f6c23e" }
  ];

  return (
    <div className="admin-dashboard-container">
      <Topbar toggleSidebar={toggleSidebar} />

      <div className="admin-main-content">
        <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
          {sidebarOpen && <Sidebar />}
        </div>

        <div className={`dashboard-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          <div className="content-wrapper">
            <div className="dashboard-header">
              <h2>Admin Dashboard</h2>
              <p className="welcome-message">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            <div className="dashboard-cards">
              {stats.map((stat, index) => (
                <div className="card" key={index} style={{ borderLeft: `4px solid ${stat.color}` }}>
                  <div className="card-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="card-content">
                    <h3>{stat.title}</h3>
                    <p className="card-value">{stat.value}</p>
                    <p className="card-trend" style={{ color: stat.color }}>{stat.trend}</p>
                  </div>
                </div>
              ))}
            </div>
              <DashboardCharts 
                deliverPercent={dashboardData.deliverPercent} 
                pendingPercent={dashboardData.pendingPercent} 
                cancelledPercent={dashboardData.cancelledPercent} 
              />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard