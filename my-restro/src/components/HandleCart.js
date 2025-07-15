 import axios from "axios";
 // posting add to cart
    const HandleCart = async (item) => {
    const token = localStorage.getItem("token");
    const cartItem = {
    itemId: item._id, 
    name: item.name,
    price: item.price,
    image: item.image,
    inStock: item.inStock ?? true
    };

    try {
      const res = await axios.post("https://resturent-management-backend-xhsx.onrender.com/api/add-to-cart", { item: cartItem }, {
      headers: { Authorization: `Bearer ${token}` }
    });
      alert(res.data.message);
    } catch (err) {
    alert(err.response?.data?.error || "Failed to add to cart");
    }
  };
  export default HandleCart;