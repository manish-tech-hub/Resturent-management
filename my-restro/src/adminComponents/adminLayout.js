import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminTopbar from './Topbar';
import { Outlet } from 'react-router-dom';
import './css/layout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate()

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  useEffect(()=>{
    const token = sessionStorage.getItem("adminToken")
    if(!token){
      navigate("/admin/login")
    }
  },[navigate])

  return (
    <div className="admin-layout">
      {sidebarOpen && <Sidebar />}
      <div className="admin-main">
        <AdminTopbar toggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <Outlet context={{ sidebarOpen }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
