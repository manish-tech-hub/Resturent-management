import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./css/reviewslider.css"

import slide4 from "./image/slide4.jpeg";

const reviews = [
  { id: 1, name: "Manish Pasman", role: "Customer", review: "Great restaurant", image: slide4 },
  { id: 2, name: "Alice", role: "Customer", review: "Nice food!", image: slide4 },
  { id: 3, name: "Bob", role: "Customer", review: "Awesome service", image: slide4 },
  { id: 4, name: "Jane", role: "Customer", review: "Loved it", image: slide4 },
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
          <p className="review-role">{review.role}</p>
        </div>
      ))}
    </Slider>
  </div>
);
};

export default Review;
