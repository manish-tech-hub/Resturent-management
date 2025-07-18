import React, { useEffect, useState, memo } from "react";
import DirectOrderButton from "./HandleDirectOrder";
import "./css/foodmenu.css";
import axios from "axios";

// Memoized FoodCard component
const FoodCard = memo(({ item }) => (
  <div className="food-card" key={item._id}>
    <img id="pimage" src={item.image} alt={item.name} loading="lazy" />
    <h3 className="food-title">{item.name}</h3>
    <p className="price">Rs. {item.price}</p>
    <p className="description">{item.description}</p>
    <DirectOrderButton item={item} className="order-btn">
      Order Now
    </DirectOrderButton>
  </div>
));

function FoodMenu() {
  const [todayItems, setTodayItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://resturent-management-backend-xhsx.onrender.com/api/menu/today-special")
      .then((res) => {
        setTodayItems(res.data);
      
      })
      .catch((err) => {
        console.error(err);
        
      });
  }, []);
  return (
    <>
      <h2 className="menu-title">Today’s Special</h2>
      <div className="card-wrap">
        {todayItems.map((item) => (
          <FoodCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
}

export default FoodMenu;
