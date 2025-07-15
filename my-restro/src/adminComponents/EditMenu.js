import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "./css/additeam.css"; // reuse the same style

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sidebarOpen } = useOutletContext();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/menu/${id}`);
        const { name, category, price, description, image } = res.data;
        setForm({ name, category, price, description });
        setExistingImage(image); // store current image
      } catch (err) {
        console.error("Failed to load item", err);
        alert("Error loading item data.");
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(`http://localhost:3001/api/menu/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item updated successfully!");
      navigate("/admin/menu");
    } catch (err) {
      console.error("Update failed", err.response?.data || err.message);
      alert("Failed to update item.");
    }
  };

  return (
    <div className={`add-item-container ${sidebarOpen ? "with-sidebar" : "full-width"}`}>
      <h2>Edit Menu Item</h2>
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
        />
        {existingImage && !imageFile && (
          <img src={existingImage} alt="Current" style={{ height: "100px", marginTop: "10px",width:"95px" }} />
        )}
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
};

export default EditItem;
