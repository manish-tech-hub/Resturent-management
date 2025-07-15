import React from "react";
import { useNavigate } from "react-router-dom";

const DirectOrderButton = ({ item, className, children }) => {
  const navigate = useNavigate();

  const handleDirectOrder = () => {
    const quantity = item.quantity || 1;
    const price = Number(item.price);

    const subtotal = price * quantity;
    const shipping = 50;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    navigate("/checkout", {
      state: {
        items: [{ ...item, quantity }],
        summary: {
          subtotal,
          shipping,
          tax,
          total
        }
      }
    });
  };

  return (
    <button onClick={handleDirectOrder} className={className}>
      {children}
    </button>
  );
};

export default DirectOrderButton;
