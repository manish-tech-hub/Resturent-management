// PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return null; // or a loading spinner

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
