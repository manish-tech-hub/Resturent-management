import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./css/reviewslider.css"

import customer1 from "./image/c1.jpg";
import customer2 from "./image/c2.jpg";
import customer3 from "./image/c3.jpg";

const reviews = [
  {
    id: 1,
    name: "Manish Pasman",
    role: "Customer",
    review: "Absolutely loved the food and the ambiance. The staff was friendly and service was quick!",
    image: customer1,
  },
  {
    id: 2,
    name: "Alicy",
    role: "Customer",
    review: "Delicious meals with fresh ingredients. I’ll definitely be coming back again!",
    image: customer2,
  },
{
    id: 3,
    name: "Bob",
    role: "Customer",
    review: "Exceptional service and a cozy atmosphere. The dishes were flavorful and well presented.",
    image: customer1,
  },
  {
    id: 4,
    name: "Jane",
    role: "Customer",
    review: "A hidden gem! Everything from starters to dessert was top-notch. Highly recommend!",
    image: customer3,
  }
];

const Review = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,          // show 3 cards at a time
    slidesToScroll: 1,
    centerMode: true,         // center active slide
    centerPadding: "0px",     // no side padding, so active fully centered
    focusOnSelect: true,
    autoplay:true,
    autoplaySpeed:2000,
  };

 return (
  <div className="review-slider-container">
    <h2 id='rw'>Our Customers Reviews</h2>
    <Slider {...settings}>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <img className="review-avatar" src={review.image} alt={review.name} />
          <p className="review-text">{review.review}</p>
          <h4 className="review-name">{review.name}</h4>
          
        </div>
      ))}
    </Slider>
  </div>
);
};

export default Review;
