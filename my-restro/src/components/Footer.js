import React from 'react';
import "./css/footerstyle.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h4>About Us</h4>
        <ul>
          <li><a href="#">Our Story</a></li>
          <li><a href="#">Chef & Team</a></li>
          <li><a href="#">Our Vision</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h4>Menu</h4>
        <ul>
          <li><a href="#">Today's Specials</a></li>
          <li><a href="#">Full Menu</a></li>
          <li><a href="#">Catering Services</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h4>Customer Support</h4>
        <ul>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Order Tracking</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h4>Follow Us</h4>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">YouTube</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
