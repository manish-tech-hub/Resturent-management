import React from "react";
import AboutUs from "./AboutUs";
import { motion } from "framer-motion";
import cto from "./image/cto.jpg"
import hr from "./image/HR.jpg"
import ceo from "./image/CEO.jpg"
import manager from "./image/manager.jpg"
import "./css/aboutus.css";
function AboutFull(){
const staffs = [
  {
    id: 1,
    name: "John",
    role: "CEO",
    messge: "Welcome to our restaurant! We’re committed to delivering excellence.",
    image: ceo,
  },
  {
    id: 2,
    name: "Emily",
    role: "Manager",
    messge: "Your satisfaction is our top priority. We ensure smooth operations every day.",
    image: manager,
  },
  {
    id: 3,
    name: "Michally",
    role: "HR",
    messge: "We value our team and customers alike. Enjoy your experience!",
    image: cto,
  },
  {
    id: 4,
    name: "Sophia",
    role: "CTO",
    messge: "Bringing innovation to your table through seamless digital service.",
    image: hr,
  }
];

    return(
        <motion.div initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>
        
        <AboutUs/>
      <section className="staff-section">
      <h2>Our Head Staffs</h2>
      <div className="staff-cards">
          {staffs.map((staff) => (
            <div key={staff.id} className="staff-card">
                <img src={staff.image} alt=" of staff" />
                <h3>{staff.name}</h3>
                <p>{staff.role}</p>
                <p className="staff-msg">"{staff.messge}"</p>
              </div>
            ))}
        </div>
        </section>

      <section className="contact-section">
        <h2>Contact & Location</h2>
        <p><strong>Address:</strong> jankalyan Street,Kathmandu, Nepal</p>
        <p><strong>Phone:</strong> +977-9815839385</p>
        <p><strong>Email:</strong> contact@yummyrestro.com</p>
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