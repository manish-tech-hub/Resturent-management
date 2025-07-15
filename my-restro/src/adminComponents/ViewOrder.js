import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import "./css/vieworder.css"; // Create your CSS file

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
   const { sidebarOpen } = useOutletContext()

  useEffect(() => {
    axios.get(`http://localhost:3001/api/order/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed to fetch order:", err));
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className={`view-order-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>Order Details</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <h3>Customer Info</h3>
      <p><strong>Name:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
      <p><strong>Email:</strong> {order.customerInfo.email}</p>
      <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.country} - {order.customerInfo.zipCode}</p>

      <h3>Order Items</h3>
      <ul>
        {order.orderItems.map((item, idx) => (
          <li key={idx}>
            <img src={item.image} alt={item.name} width="50" />
            <p><strong>{item.name}</strong> - ₹{item.price} x {item.quantity}</p>
          </li>
        ))}
      </ul>

      <h3>Summary</h3>
      <p><strong>Subtotal:</strong> ₹{order.summary.subtotal}</p>
      <p><strong>Tax:</strong> ₹{order.summary.tax}</p>
      <p><strong>Total:</strong> ₹{order.summary.total}</p>
    </div>
  );
};

export default ViewOrder;
