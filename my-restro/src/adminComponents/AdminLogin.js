import React,{useState} from 'react';
import './css/alogin.css';
import { motion } from "framer-motion";
import slide1 from './image/slide1.jpeg'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function AdminLogin() {
    const [formdata,setFormData]=useState({
        number:"",
        password:""
    })
    const navigate = useNavigate()
    const handleChange=(e)=>{
        setFormData({...formdata,[e.target.name]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res = await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/adminlogin",{
                number:formdata.number,
                password:formdata.password
            });
            alert(res.data.message)
            sessionStorage.setItem("adminToken", res.data.token);
            navigate("/admin/dashboard")
        }catch(err){
            alert(err.response?.data?.error || "login failed");
        }
    }
  
  return (
    < motion.div className="login-page" initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>

      <div className="login-card-split">
        <div className="login-image-side">
          <img src={slide1} alt="Restaurant" className="restaurant-img" />
        </div>
        <div className="login-form-side">
          <h2 className="login-title">🍽️ Welcome Admin</h2>
          <p className="login-subtitle">Log in to manage your resturent</p>
          <form className="login-form" onSubmit={handleSubmit} >
            <div className="form-group">
              <label>Mobile No</label>
              <input
                type="tel"
                className="login-input"
                name='number'
                value={formdata.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="login-input"
                name='password'
                value={formdata.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminLogin;
