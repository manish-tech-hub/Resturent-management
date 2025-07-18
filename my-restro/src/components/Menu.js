import React, { useEffect, useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import HandleCart from "./HandleCart";
import DirectOrderButton from "./HandleDirectOrder";
import "./css/menu.css";
import axios from "axios";

function Menu({ searchQuery }) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios
      .get(`https://resturent-management-backend-xhsx.onrender.com/api/menu?search=${searchQuery}`)
      .then((res) => {
        setMenuItems(res.data);
      })
      .catch((err) => console.error(err));
  }, [searchQuery]);

  const isSearching = searchQuery && searchQuery.trim() !== "";

  // Memoize filtered items to avoid recalculating on every render
  const filteredItems = useMemo(() => {
    if (!isSearching) return [];
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery, isSearching]);

  const noMatch = isSearching && filteredItems.length === 0;

  return (
    <motion.div
      className="menu-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h2 className="menu-title">Our Menu</h2>

      {isSearching && !noMatch && (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MemoMenuCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {noMatch && (
        <>
          <p className="empty-data">No items found for '{searchQuery}'</p>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <MemoMenuCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}

      {!isSearching && (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <MemoMenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

const MenuCard = ({ item }) => {
  const [isFav, setIsFav] = useState(false);

  const handleFav = async () => {
    const token = localStorage.getItem("token");
    const cartItem = {
      itemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    };

    try {
      const res = await axios.post(
        "https://resturent-management-backend-xhsx.onrender.com/api/add-to-fav",
        { item: cartItem },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace alert with console.log or your toast notification
      console.log(res.data.message);
      setIsFav(true);
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to add to favorite");
    }
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
        <button onClick={handleFav} className="fav-btn" aria-label="Toggle favorite">
          {isFav ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
        <DirectOrderButton item={item} className="order-btn1">
          Order Now
        </DirectOrderButton>
        <button className="cart-btn" onClick={() => HandleCart(item)} aria-label="Add to cart">
          <FaShoppingCart />
        </button>
      </div>
    </div>
  );
};

// Memoized version of MenuCard
const MemoMenuCard = memo(MenuCard);

export default Menu;
