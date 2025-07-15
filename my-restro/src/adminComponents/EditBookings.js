import {useState,useEffect} from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./css/editbookings.css";
import axios from "axios";

function EditBookings() {
  const {id} = useParams()
  const [formData,setformData]=useState({
    name:"",
    phonenumber:"",
    date:"",
    entrytime:"",
    exittime:"",
    guest:"",
    table:""

  });
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchData =async()=>{
        try{
            const res = await axios.get(`http://localhost:3001/api/editbooking/${id}`)
            setformData(res.data)
        }catch (err) {
      console.error("Failed to fetch booking", err);
      alert("Error loading booking data.");
    }
  }
  fetchData()
},[id])

  const handleChange=(e) =>{
    setformData({...formData,[e.target.name]:e.target.value});

  }
  const handleSubmit= async (e)=>{
    e.preventDefault()
    try{
      await axios.put(`http://localhost:3001/api/editbooking/${id}`, formData);
      alert('Data updated successfully')
      navigate('/admin/table')
    }catch(err){
      alert("booking failed")
      console.log(err)
    }

  }

  return (
    <div className="form-wrapper">
      <h2>Book a Table {formData.table}</h2>
      <form className="simple-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} />
        <label>Number</label>
        <input type="tel" placeholder="Phone Number" name="phonenumber"value={formData.phonenumber} onChange={handleChange}/>
        <label>Date</label>
        <input type="date" name="date"value={formData.date} onChange={handleChange}/>
        <label>Entry Time</label>
        <input type="time"name="entrytime" value={formData.entrytime} onChange={handleChange}/>
        <label>Exit Time</label>
        <input type="time"name="exittime"value={formData.exittime} onChange={handleChange}/>
        <label>Number</label>
        <input type="number" placeholder="Number of Guests" value={formData.guest} name="guest" onChange={handleChange} />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default EditBookings;
