import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css'; // Reuse same styles
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import slide1 from './image/slide1.jpg';
import axios from 'axios';

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try{
        const res = await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/signup",{
            name,
            email,
            password
        });
        alert(res.data.message);
        navigate('/login');
    }
    catch (err){
        alert(err.response?.data?.error || "Signup failed");

    }
  };

  return (
    <motion.div className="login-page" initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>
      
      <div className="login-card-split">
        <div className="login-image-side">
          <img src={slide1} alt="Restaurant" className="restaurant-img" />
        </div>
        <div className="login-form-side">
          <h2 className="login-title">📝 Sign Up</h2>
          <p className="login-subtitle">Join our food community!</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="login-input"
                onChange={(e)=> setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="login-input"
                onChange={(e)=> setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="login-input"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="login-input"
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Sign Up</button>
            <p className="forgot-password">
              Already have an account? <Link to="/login" style={{ color: '#B86AA7' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default SignUp;
