
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const isLoggedIn = !!localStorage.getItem("token"); 

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;

