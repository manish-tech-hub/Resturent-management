import React, { useEffect, useState } from 'react';
import slide1 from "./image/slide1.jpeg";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './css/cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate=useNavigate()
  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:3001/api/cart-items", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const orderSummary ={
    subtotal,
    shipping,
    tax,
    total
  }
  const handleCheckout=()=>{
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate("/checkout",{state:orderSummary})
  }
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");

    try {
      await axios.put("http://localhost:3001/api/update-cart", {
        itemId, newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev =>
        prev.map(item => item.itemId === itemId ? { ...item, quantity: newQuantity } : item)
      );
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:3001/api/remove-cart-item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId }
      });
      setCartItems(prev => prev.filter(item => item.itemId !== itemId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <motion.div className="cart-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>

      <div className="cart-header">
        <Link to="/home"><button className="continue-shopping">← Continue Shopping</button></Link>
        <h1 className="cart-title">
          Your Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </h1>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-header">
            <div className="header-product">Product</div>
            <div className="header-price">Price</div>
            <div className="header-quantity">Quantity</div>
            <div className="header-total">Total</div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">Your cart is empty</div>
          ) : (
            <ul className="items-list">
              {cartItems.map((item) => (
                <li key={item.itemId} className="cart-item">
                  <div className="item-product">
                    <img src={item.image || slide1} alt={item.name} className="item-image" />
                    <div>
                      <h3>{item.name}</h3>
                      {!item.inStock && <span className="out-of-stock">Out of Stock</span>}
                    </div>
                  </div>
                  <div className="item-price">Rs.{item.price.toFixed(2)}</div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">Rs.{(item.price * item.quantity).toFixed(2)}</div>
                  <button onClick={() => removeItem(item.itemId)} className="remove-item">×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>Rs.{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Rs.{shipping.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax</span><span>Rs.{tax.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>Rs.{total.toFixed(2)}</span></div>
          <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
