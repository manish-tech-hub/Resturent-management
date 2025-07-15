import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useOutletContext } from "react-router-dom";
import { Link } from 'react-router-dom';
import './css/user.css';
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { sidebarOpen } = useOutletContext();
  useEffect(()=>{
    async function fetchUsers(){
      try{
        const res = await axios.get("http://localhost:3001/api/allusers")
        setUsers(res.data)
      }catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }
    fetchUsers()

  },[]);
  const handleDelete=async(id)=>{
    if(!window.confirm("Are you sure want to delete this user")) return
    try{
      await axios.delete(`http://localhost:3001/api/del-user/${id}`)
      alert("user deleted sucessfully")
      setUsers((prevUser)=>prevUser.filter(users=>users._id !== id))
    }catch(err){
      alert(err.response?.data?.error || "failled to delete users")
    }
  }
  const handleToggle = async (id) => {
  try {
    const res = await axios.put(`http://localhost:3001/api/block-user/${id}`);
    alert(res.data.message);

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status: res.data.status } : user
      )
    );
  } catch (err) {
    alert(err.response?.data?.error || "Failed to block/unblock user");
  }
};
  return (
    <div className={`admin-users-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>User Management</h2>
      
      <div className="users-actions">
        <div className="users-search-container">
          <input
            type="text"
            className="users-search"
            placeholder="Search users..."
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
      
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user,index) => (
                <tr key={user._id}>
                  <td>{index+1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`status-badge ${user.status === 'active' ? 'active' : 'blocked'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/users/edituser/${user._id}`}><button className="action-btn edit">
                      <FaEdit />
                    </button></Link>
                    <button 
                      className="action-btn delete" onClick={()=>handleDelete(user._id)}
                    >
                      <FaTrash />
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        className="action-btn block"
                        onClick={()=>handleToggle(user._id)}
                      >
                        <FaBan />
                      </button>
                    ) : (
                      <button 
                        className="action-btn unblock" 
                        onClick={()=>handleToggle(user._id)}
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;