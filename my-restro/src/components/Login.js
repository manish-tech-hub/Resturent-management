import React,{useState} from 'react';
import './css/login.css';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import slide1 from './image/slide1.jpg'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] =useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/login",{
        email,
        password
      });
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      navigate("/home")

    }
    catch(err){
      alert(err.response?.data?.error || "login failed")
    }
  };

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
          <h2 className="login-title">🍽️ Welcome Back</h2>
          <p className="login-subtitle">Log in to explore delicious dishes</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="login-input"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="login-input"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="login-button">Login</button>
            <p className="forgot-password">Forgot password?</p>
            <p className='forgot-password'><Link to="/singup" style={{ color: '#B86AA7' }}>Sing Up</Link></p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
