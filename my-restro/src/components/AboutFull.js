import React from "react";
import AboutUs from "./AboutUs";
import { motion } from "framer-motion";
import slide1 from "./image/slide1.jpeg";
import "./css/aboutus.css";
function AboutFull(){
    return(
        <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>
        
        <AboutUs/>
      <section className="staff-section">
        <h2>Our Head Staff</h2>
        <div className="staff-cards">
          <div className="staff-card">
            <img src={slide1} alt="Chef John" />
            <h3>Chef John Doe</h3>
            <p>Executive Chef</p>
          </div>
          <div className="staff-card">
            <img src={slide1} alt="Manager Jane" />
            <h3>Jane Smith</h3>
            <p>Restaurant Manager</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact & Location</h2>
        <p><strong>Address:</strong> 123 Flavor Street, Food City, Country</p>
        <p><strong>Phone:</strong> +123 456 7890</p>
        <p><strong>Email:</strong> contact@yourrestaurant.com</p>
         <iframe
            title="Karjanha Vegetable Market Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.643956899215!2d86.17526017495486!3d26.85127447668386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec1c07d657fde7%3A0xbf35df959e96f65d!2sKarjanha%20Vegetable%20Market!5e0!3m2!1sen!2snp!4v1749376719540!5m2!1sen!2snp"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
        </motion.div>
    )
}
export default AboutFull;