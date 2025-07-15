import React from 'react';
import { Link } from 'react-router-dom';
import './css/sidebar.css';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaUsers, 
  FaSignOutAlt, 
  FaTable, 
  FaClipboardList 
} from 'react-icons/fa'; // Added FaClipboardList for Menu
import Logout from './Logout';
const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="admin-logo">AdminPanel</h2>
      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className="sidebar-link">
          <FaTachometerAlt className="icon" /> Dashboard
        </Link>
        <Link to="/admin/orders" className="sidebar-link">
          <FaBox className="icon" /> Orders
        </Link>
        <Link to="/admin/users" className="sidebar-link">
          <FaUsers className="icon" /> Users
        </Link>
        <Link to="/admin/table" className="sidebar-link">
          <FaTable className="icon" /> Table Booking
        </Link>
        <Link to="/admin/menu" className="sidebar-link">
          <FaClipboardList className="icon" /> Menu
        </Link>
        <Logout/>
      </nav>
    </div>
  );
};

export default Sidebar;
