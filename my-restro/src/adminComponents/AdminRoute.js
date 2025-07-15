import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const isAdminLoggedIn = sessionStorage.getItem("adminToken"); // or check a context, cookie, etc.

  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
