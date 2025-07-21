import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/alogin.css';
import { motion } from "framer-motion";
import slide1 from './image/slide1.jpg'; 
import axios from 'axios';

function CreateAdmin() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Add validation or API call here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try{
        const res = await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/createadmin",{
            name:formData.fullName,
            number:formData.mobile,
            password:formData.password
            
        })
        alert(res.data.message)
        navigate("/admin/dashboard")

    }catch(err){
        alert(err.response?.data?.error || "Signup failed");
    }

    console.log("Creating Admin:", formData);
    // Send data to backend here
  };

  return (
    <motion.div className="login-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="login-card-split">
        <div className="login-image-side">
          <img src={slide1} alt="Restaurant" className="restaurant-img" />
        </div>
        <div className="login-form-side">
          <h2 className="login-title">👨‍🍳 Create New Admin</h2>
          <p className="login-subtitle">Fill the form to add a new admin</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className="login-input"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mobile No</label>
              <input
                type="tel"
                name="mobile"
                className="login-input"
                required
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="login-input"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="login-button">Create Admin</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
export default CreateAdmin;
