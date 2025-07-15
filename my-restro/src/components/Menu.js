import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import HandleCart from "./HandleCart";
import DirectOrderButton from "./HandleDirectOrder";
import "./css/menu.css";
import axios from "axios";

function Menu({ searchQuery}) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get(`https://resturent-management-backend-xhsx.onrender.com/api/menu?search=${searchQuery}`)
      .then((res) => {
        setMenuItems(res.data);
      })
      .catch((err) => console.error(err));
  }, [searchQuery]); 

  const isSearching = searchQuery && searchQuery.trim() !== "";
  const filteredItems = isSearching
    ? menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const noMatch = isSearching && filteredItems.length === 0;

  return (
    <motion.div className="menu-container" initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>

      <h2 className="menu-title">Our Menu</h2>

      {isSearching && !noMatch && (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {noMatch && (
        <>
          <p className="empty-data">
            No items found for '{searchQuery}'
          </p>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}

      {!isSearching && (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
}


function MenuCard({ item }) {
     const [isFav, setIsFav] = useState(false);
     const toggleFavorite = () => setIsFav(!isFav);
    const handleFav =async()=>{
      const token = localStorage.getItem("token");
      const cartItem = {
        itemId: item._id, 
        name: item.name,
        price: item.price,
        image: item.image,
        };

      await axios.post("http://localhost:3001/api/add-to-fav",{item:cartItem},
        {headers:{Authorization:`Bearer ${token}`}}
      )
      .then(res=> alert(res.data.message))
      .catch(err=> alert(err.response?.data?.error || "faild to add to favorite"))
    };

  return (
    <div className="menu-card">
      <img src={item.image} alt={item.name} className="menu-image" />
      <h3>{item.name}</h3>
      <p className="menu-desc">{item.description}</p>
      <p className="menu-price">
        Rs.{typeof item.price === "number" ? item.price.toFixed(2) : "N/A"}
      </p>
      {item.offer && <span className="menu-offer">{item.offer}</span>}
      <p className="menu-category">{item.category}</p>

      <div className="menu-actions">
        {/* Favorite Heart */}
        <button onClick={()=>{toggleFavorite(); handleFav();}} className="fav-btn" aria-label="Toggle favorite">
          {isFav ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>

          {/* Order Now Button */}
        <DirectOrderButton item={item} className="order-btn1"> Order Now</DirectOrderButton>

        {/* Cart Icon Button */}
        <button className="cart-btn" type="button" aria-label="Add to cart" onClick={()=>HandleCart(item)}>
          <FaShoppingCart />
        </button>
      </div>
    </div>
  );
}

export default Menu;
