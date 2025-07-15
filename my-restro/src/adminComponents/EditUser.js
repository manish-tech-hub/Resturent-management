import React,{useState,useEffect, use} from "react";
import { useParams } from "react-router-dom";
import "./css/edituser.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
function EditUser(){
    const [userInfo, setUserInfo]=useState({
        name:"",
        mobile:"",
        address:"",
        password:""
    })
    const {id} = useParams()
    const navigate = useNavigate()
    const handleChange=(e)=>{
        setUserInfo({...userInfo,[e.target.name]:e.target.value})
    }
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const res =  await axios.get(`http://localhost:3001/api/user-info/${id}`)
                setUserInfo({
                    name:res.data.name,
                    mobile:res.data.mobile,
                    address:res.data.address,
                    password:""
                })
            }catch (error) {
                 console.error("Error fetching user data:", error);
            }
        }
        fetchData()

    },[id])
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            await axios.put(`http://localhost:3001/api/update-user-info/${id}`,{
                name:userInfo.name,
                mobile:userInfo.mobile,
                address:userInfo.address,
                newPassword:userInfo.password
            })
            alert("user updated successfully")
            navigate("/admin/users")
        }catch(error){
            console.err("update failed",error)
        }
    }
    return(
        <div className="edit-user-info">
            <h2>Editing user info </h2>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name"value={userInfo.name} onChange={handleChange}/>
                <label>Mobile No</label>
                <input type="text" name="mobile"value={userInfo.mobile} onChange={handleChange}/>
                <label>Address</label>
                <input type="text" name="address"value={userInfo.address} onChange={handleChange}/>
                <label>Password</label>
                <input type="password" name="password"value={userInfo.password} onChange={handleChange}/>
                <button>submit</button>
            </form>

        </div>
    
    )
}
export default EditUser