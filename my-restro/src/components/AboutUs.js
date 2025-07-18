import React from "react";
import "./css/aboutus.css";
import resturent from "./image/resturentImg.jpg"; // restaurant image
// import chefImage from "./image/chef.jpg"; // add real staff images

function AboutUs() {
  return (
    <>
      <section className="about-us">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to <strong>Yummy-Restro</strong>, where flavor meets tradition!
            We’ve been serving delicious meals with love and passion since 2010.
            Our chefs use only the freshest ingredients to create mouth-watering dishes that bring people together.
          </p>
          <p>
            Whether you’re here for a quick lunch, a romantic dinner, or a family gathering,
            we promise a warm atmosphere, friendly staff, and unforgettable food.
          </p>
        </div>
        <div className="about-image">
          <img src={resturent} alt="Inside view of the restaurant" />
        </div>
      </section>
    </>
  );
}

export default AboutUs;
