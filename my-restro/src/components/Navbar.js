import React, { useState } from "react";
import "./css/navbar.css";
import { FaUser, FaShoppingCart, FaSearch, FaTimes, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchChange = (e) => {
    setInputValue(e.target.value); // only update local input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue); // update app-level search query
    navigate("/menu"); // then navigate
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">MyRestro</Link>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/booktable" onClick={() => setMenuOpen(false)}>Book Table</Link></li>
        <li><Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link></li>
      </ul>

      {/* Icons & Search */}
      <div className="navbar-icons">
        <form className="search-wrapper" onSubmit={handleSubmit}>
          <button type='button' className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={inputValue}
            onChange={handleSearchChange}
          />
          <button className="submit-btn" type="submit">
            <FaSearch className="search-icon" />
          </button>
        </form>

        <Link to="/profile"><FaUser className="icon" title="Account" /></Link>
        <Link to="/cart"><FaShoppingCart className="icon" title="Cart" /></Link>
      </div>
    </nav>
  );
}

export default Navbar;
