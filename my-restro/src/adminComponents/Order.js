import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./css/order.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]); // initialize as array
  const { sidebarOpen } = useOutletContext();

  const statusColor = {
  cancelled: "orange",
  delivered: "green",
  pending: "blue",
 };


  useEffect(() => {
    async function fetchOrders() {
      const token = sessionStorage.getItem("adminToken")
      try {
        const { data } = await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/allorder",{headers:{Authorization:`Bearer ${token}`}});
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }
    fetchOrders();
  }, []);
  const handleDelete=async(id)=>{
    if(!window.confirm("Are you sure want to delete ?")) return
      try{
        await axios.delete(`https://resturent-management-backend-xhsx.onrender.com/api/del-order/${id}`) 
        alert('order deleted succesfully')
        setOrders((preOreder)=>preOreder.filter(orders=>orders._id !==id))
      }catch(err){
        alert(err.response?.data?.error || "failled to delete booking")
      }
  }

  return (
    <div className={`admin-orders-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>Orders Management</h2>

      <div className="orders-actions">
        <input
          type="text"
          placeholder="Search orders by ID, customer, status..."
          className="orders-search"
        />
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index +1}</td>
                  <td>{`${order.customerInfo?.firstName} ${order.customerInfo?.lastName}`}</td>
                  <td>{order.userDetails?.phone}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="status-badge"
                        style={{backgroundColor: statusColor[order.status?.toLowerCase()] || "gray",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold"
                      }}>
                      {order.status}
                    </span>
                  </td>
                  <td>₹{order.summary?.total}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/orders/vieworder/${order._id}`}><button className="action-btn view" title="View Order">
                      <FaEye />
                    </button></Link>
                    <button className="action-btn edit" title="Edit Order">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete Order" onClick={()=>handleDelete(order._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
