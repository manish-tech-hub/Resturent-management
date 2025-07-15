import {useEffect,useState} from "react";
import { motion } from "framer-motion";
import "./css/tablestyle.css";
import { Link } from "react-router-dom";
import axios from "axios";
function Tables() {
  const [tables,settables]=useState([]);

  useEffect(()=>{
    axios.get('https://resturent-management-backend-xhsx.onrender.com/api/tables')
    .then(res =>{
      settables(res.data)
    })
  },[])
  return (
    <motion.div className="table-booking-container"  initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}>
        
      <h2 className="booking-header">Book Your Table</h2>
      <p className="booking-subheader">
        Select from our premium dining tables
      </p>

      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-item ${table.status}`}
          >
            <div className="table-shape">
              <div className="table-surface">
                <span className="table-id">{table.tableNo}</span>
                <span className="table-capacity">👥 {table.capacity}</span>
              </div>
              <div className="table-base"></div>
            </div>
             {table.status === "available" ? (
                <Link to={`/book/${table.tableNo}`}>
                <button className="book-button available">Book Now</button>
                </Link>
                
                ) : (
                     <button className={`book-button ${table.status}`} disabled>
                     {table.status === "available" ? "available" : "Booked"}
                 </button>
                )}

            {table.status === "booked" && (
              <div className="reserved-badge">Booked</div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Tables;