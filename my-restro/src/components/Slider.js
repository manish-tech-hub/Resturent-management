import React, { lazy, Suspense } from "react";
import AboutUs from "./AboutUs";
import Review from "./Review";
import './css/homestyle.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import FadeInSection from "./FadeIn";
import slide1 from "./image/slide1.jpeg";
import slide2 from "./image/slide2.jpeg";
import slide3 from "./image/slide3.jpeg";
import slide4 from "./image/slide4.jpeg";

// Lazy load FoodMenu
const FoodMenu = lazy(() => import("./FoodMenu"));

function Slider(){
  const sologonContent = (
    <motion.div
      className="sologon"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2>Hi, Welcome To MyRestro</h2>
      <p>
        Savor Every Bite, Feel the Delight!<br />
        Fresh Ingredients, Flavors Divine<br />
        Crafted with Love, Served with a Smile<br />
        Your Table, Our Passion – Where Taste Lives!
      </p>
      <button type="submit" id="order">Order now!</button>
    </motion.div>
  );
    
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <section className="home-section">
        <Carousel
          autoPlay={true}
          interval={3000}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          stopOnHover={false}
          swipeable={true}
          emulateTouch={true}
          transitionTime={800}
        >
          <div>
            <img src={slide1} alt="burger" />
            {sologonContent}
          </div>
          <div>
            <img src={slide2} alt="burger" />
            {sologonContent}
          </div>
          <div>
            <img src={slide3} alt="burger" />
            {sologonContent}
          </div>
          <div>
            <img src={slide4} alt="burger" />
            {sologonContent}
          </div>
        </Carousel>

        {/* Lazy load FoodMenu with fallback */}
        <Suspense fallback={<div style={{ padding: 20, textAlign: "center" }}>Loading Menu...</div>}>
          <FoodMenu />
        </Suspense>

        {/* Scroll-triggered animations on lighter components */}
        <FadeInSection><AboutUs /></FadeInSection>
        <FadeInSection><Review /></FadeInSection>
      </section>
    </motion.div>
  );
}

export default Slider;
