import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import{FaSignOutAlt} from 'react-icons/fa'

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login"); // or "/home" as you want
  };

  return (
    <div>
      <Link to="/admin/login"> <button className="sidebar-link logout" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout</button>
        </Link>
    </div>
  );
}

export default Logout;
