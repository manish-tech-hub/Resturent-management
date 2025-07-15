import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/checkout.css';

const Checkout = () => {
  const [checkoutDetail, setCheckoutDetail] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });

  const [paymentDetail, setPaymentDetail] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: ""
  });

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state;

    if (state?.items && state?.summary) {
      setItems(state.items);
      setSummary(state.summary);
    } else {
      const storedItems = JSON.parse(localStorage.getItem("cartItems"));
      if (storedItems) {
        setItems(storedItems);
        const subtotal = storedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shipping = 50;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        setSummary({ subtotal, shipping, tax, total });
      }
    }
  }, [location.state]);

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetail(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/order-detail", {
        customerInfo: checkoutDetail,
        payment: paymentDetail,
        orderItems: items,
        summary
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Order placed successfully");
      localStorage.removeItem("cartItems");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to place order');
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Shipping Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" onChange={handleCheckoutChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" onChange={handleCheckoutChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" onChange={handleCheckoutChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" onChange={handleCheckoutChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" onChange={handleCheckoutChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input type="text" id="country" name="country" onChange={handleCheckoutChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" onChange={handleCheckoutChange} required />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment Details</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" onChange={handlePaymentChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="cardName">Name on Card</label>
              <input type="text" id="cardName" name="nameOnCard" onChange={handlePaymentChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="date" id="expiryDate" name="expiryDate" onChange={handlePaymentChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" placeholder="123" onChange={handlePaymentChange} required />
              </div>
            </div>

            <div className="form-checkbox">
              <input type="checkbox" id="saveInfo" name="saveInfo" />
              <label htmlFor="saveInfo">Save payment information for next time</label>
            </div>
          </section>

          <button type="submit" className="checkout-button">Complete Order</button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Subtotal</span>
            <span>Rs.{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>Rs.{summary.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax</span>
            <span>Rs.{summary.tax.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>Rs.{summary.total.toFixed(2)}</span>
          </div>

          <div className="cart-items-check">
            <h3>Your Items</h3>
            {items.map((item, index) => (
              <div className="cart-item-check" key={index}>
                <img src={item.image} alt="Product" />
                <div className="item-details-check">
                  <span className="item-name-check">{item.name}</span>
                  <span className="item-price-check">Rs.{item.price}</span>
                  <span className="item-quantity-check">Qty.{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
