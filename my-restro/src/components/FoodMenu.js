import { useEffect, useState } from "react";
import DirectOrderButton from "./HandleDirectOrder";
import "./css/foodmenu.css";
import slide4 from "./image/slide4.jpeg";
import axios from "axios";
import { Link } from "react-router-dom";

function FoodMenu() {
  const [todayItems, setTodayItems]=useState([])
  useEffect (()=>{
    axios.get("http://localhost:3001/api/menu/today-special")

    .then(res =>{
      console.log(res.data)
      setTodayItems(res.data)
    })
  },[])
  return (
    <>
      <h2 className="menu-title">Today’s Special</h2>
      <div className="card-wrap">
        {todayItems.map((items) =>(
          <div className="food-card" key={items._id}>
          <img id="pimage" src={items.image} alt="burger" />
          <h3 className="food-title">{items.name}</h3>
          <p className="price">Rs. {items.price}</p>
          <p className="description">{items.description}</p>
          <DirectOrderButton item={items} className="order-btn"> Order Now</DirectOrderButton>

        </div>
        ))}
      </div>
    </>
  );
}

export default FoodMenu;
