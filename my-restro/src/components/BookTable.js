import {useState,useEffect} from "react";
import { useParams } from 'react-router-dom';
import "./css/booktable.css";
import axios from "axios";

function BookTable() {
  const {tableNo} = useParams()
  const [formData,setformData]=useState({
    name:"",
    phonenumber:"",
    date:"",
    entrytime:"",
    exittime:"",
    guest:"",
    table:parseInt(tableNo)
  });

  const handleChange=(e) =>{
    setformData({...formData,[e.target.name]:e.target.value});

  }
  const handleSubmit= async (e)=>{
    e.preventDefault()
    try{
      await axios.post("http://localhost:3001/api/bookings", formData);
      alert('table booked successfully')
    }catch(err){
      alert("booking failed")
      console.log(err)
    }

  }

  return (
    <div className="form-wrapper">
      <h2>Book a Table {tableNo}</h2>
      <form className="simple-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" placeholder="Your Name" name="name" onChange={handleChange} />
        <label>Number</label>
        <input type="tel" placeholder="Phone Number" name="phonenumber" onChange={handleChange}/>
        <label>Date</label>
        <input type="date" name="date" onChange={handleChange}/>
        <label>Entry Time</label>
        <input type="time"name="entrytime" onChange={handleChange}/>
        <label>Exit Time</label>
        <input type="time"name="exittime" onChange={handleChange}/>
        <label>Number</label>
        <input type="number" placeholder="Number of Guests" name="guest" onChange={handleChange} />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default BookTable;
