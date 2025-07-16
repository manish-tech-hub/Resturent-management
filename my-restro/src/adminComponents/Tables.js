import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/bookings.css";

const AdminTables = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { sidebarOpen } = useOutletContext();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get("https://resturent-management-backend-xhsx.onrender.com/api/bookings");
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phonenumber.includes(searchTerm)
  );
  const handleDelete= async(id)=>{
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try{
      await axios.delete(`https://resturent-management-backend-xhsx.onrender.com/api/del-booking/${id}`)
      alert("booking deleted successfully")
      setBookings((previousBooking)=>previousBooking.filter(booking=> booking._id !==id))
    }catch(err){
      alert(err.response?.data?.error || "failled to delete booking")
    }
  }
  return (
    <div className={`admin-booking-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>Manage Bookings</h2>

      <div className="booking-search-container">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="booking-search"
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>Number</th>
              <th>Date</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Guest</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.name}</td>
                  <td>{booking.phonenumber}</td>
                  <td>{booking.date}</td>
                  <td>{booking.entrytime}</td>
                  <td>{booking.exittime}</td>
                  <td>{booking.guest}</td>
                  <td>{booking.tableInfo?.capacity}</td>
                  <td>{booking.tableInfo?.status || "Unknown"}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/table/editbookings/${booking._id}`}><button className="action-btn edit" title="Edit Booking">
                      <FaEdit />
                    </button></Link>
                    <button className="action-btn delete" title="Delete Booking" onClick={()=>handleDelete(booking._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTables;
