import React, { useState,useEffect } from 'react';
import HandleCart from './HandleCart';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import axios from 'axios';
import './css/userprofile.css';
const Profile = () => {
  const [user, setUser] = useState([]);
  const [favItem, setFavItem] = useState([])
  const [orderHistory, setOrderHistory]=useState([])
  useEffect(()=>{
    const fetchUserdata= async()=>{
      const token = localStorage.getItem("token");
      try{
        const res =  await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/profile",{headers:{Authorization:`Bearer ${token}`}});
        setUser(res.data)
      }catch(err){
        console.error("failed to load data", err)
      }

    }
    const fetchFavItem=async()=>{
      const token = localStorage.getItem("token");
      try{
        const res = await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/fav-items",{headers:{Authorization:`Bearer ${token}`}});
        setFavItem(res.data.items || [])
      }catch(err){
        console.error("failed to load data", err)
      }
    };
    const fethOrederHistory=async()=>{
      const token = localStorage.getItem("token");
      try{
        const res = await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/order-history",{headers:{Authorization:`Bearer ${token}`}});
        setOrderHistory(res.data.orders || []);
      }catch(err){
        console.error("failed to load data", err)

      }
    }
    fetchFavItem();
    fetchUserdata();
    fethOrederHistory();
  },[]);

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="user-profile-container">
      
      <div className="profile-header">
        <Logout/>
        <div className="profile-image-container">
          <img src={user.profileImage} alt="Profile" className="profile-image" />
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="email">{user.email}</p>
          <p className="phone">{user.phone}</p>
          <Link to="/updateprofile"><button className="edit-profile-button">Edit Profile</button></Link>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
        <button 
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-details">
            <h2>Personal Information</h2>
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{user.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user.address}</span>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="order-history">
            <h2>Your Orders</h2>
            {orderHistory.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order._id}</span>
                  <span className={`order-status ${order.status ? order.status.toLowerCase().replace(' ', '-') : ''}`}>
                    {order.status }
                  </span>
                </div>
              <div className="order-date">
              Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="order-items">
              <strong>Items:</strong>{' '}
                {Array.isArray(order.orderItems)
                ? order.orderItems.map(i => i.name).join(', ') : 'No items'}
              </div>
            <div className="order-total">
              <strong>Total:</strong> Rs.{order.summary?.total?.toFixed(2) || '0.00'}
           </div>
          </div>
          ))}
        </div>
        )}
        {activeTab === 'favorites' && (
          <div className="favorites-list">
            <h2>Your Favorite Items</h2>
            <div className="favorites-grid">
              {favItem.map((item, index) => (
                <div key={index} className="favorite-item">
                  <div className="item-image">
                   <img src={item.image} alt="menu pic" className="item-image" />
                  </div>
                  <h3>{item.name}</h3>
                  <button className="add-to-cart" onClick={()=>HandleCart(item)}>Cart</button>
                  <button className="remove">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;