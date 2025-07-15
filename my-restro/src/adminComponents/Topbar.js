import React, { useState, useRef, useEffect } from 'react';
import './css/topbar.css';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admin-topbar">
      <div className="left-icons">
        <FaBars className="hamburger-icon" onClick={toggleSidebar} title="Menu" />
      </div>

      <div className="center-message">
        Hi, <strong>Admin</strong>
      </div>

      <div className="right-icons">
        <FaBell className="topbar-icon" title="Notifications" />
        
        <div className="user-icon-wrapper" ref={popupRef}>
          <FaUserCircle
            className="topbar-icon"
            title="Profile"
            onClick={() => setShowPopup(prev => !prev)}
          />

          {showPopup && (
            <div className="user-popup">
              <Link to="/admin/createAdmin"><button className="popup-item">Create Admin</button></Link>
              {/* You can add more options here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
