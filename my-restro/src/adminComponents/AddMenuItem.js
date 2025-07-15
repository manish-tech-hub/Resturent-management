import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/additeam.css";

const AddItem = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const { sidebarOpen } = useOutletContext();
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // grab the file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("description", form.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/menu/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item added successfully!");
      navigate("/admin/menu")

      // Reset form
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add item.");
    }
  };

  return (
    <div className={`add-item-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>Add New Menu Item</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
