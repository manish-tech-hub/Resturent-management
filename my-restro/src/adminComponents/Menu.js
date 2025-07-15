import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./css/menu.css";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { sidebarOpen } = useOutletContext();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/menu-items");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    }
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const HandleDelete= async(id)=>{
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try{
      await axios.delete(`https://resturent-management-backend-xhsx.onrender.com/api/del-menu/${id}`)
      alert("item deleted successfully")
      setMenuItems((prevItems) => prevItems.filter(item => item._id !== id));
    }catch(err){
      alert(err.response?.data?.error || "Failed to delete item");
    }

  }

  return (
    <div className={`admin-menu-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <div className="top-bar">
        <Link to="/admin/menu/addItem">
          <button className="add-btn">
            <FaPlus /> Add Item
          </button>
        </Link>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="menu-search"
          />
          <span className="search-icon">
            <FaSearch />
          </span>
        </div>
      </div>

      <div className="menu-table-wrapper">
        <table className="menu-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Image</th>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.length > 0 ? (
            filteredMenu.map((item, index) => (
                <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                    <img 
                         src={item.image} 
                         alt={item.name} 
                         className="menu-item-image"
                        //  onError={(e) => e.target.src = "/placeholder.png"} // fallback image if broken
                    />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>{item.availability ? "Available" : "Out of stock"}</td>
                <td className="actions-cell">
                <Link to={`/admin/menu/editItem/${item._id}`}><button className="action-btn edit" title="Edit Item">
                    <FaEdit />
                </button></Link>
                <button className="action-btn delete" title="Delete Item" onClick={()=> HandleDelete(item._id)}>
                    <FaTrash />
                </button>
                </td>
            </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" className="no-menu">No menu items found.</td>
            </tr>
            )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenu;
