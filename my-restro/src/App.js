import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation,Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// for user
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import AboutFull from "./components/AboutFull";
import Footer from "./components/Footer";
import Tables from "./components/Tables";
import BookTable from "./components/BookTable";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import SignUp from "./components/SingUp";
import Profile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";
import Checkout from "./components/Checkout";
import "./components/css/app.css";
// for admin
import AdminLayout from "./adminComponents/adminLayout";
import Dashboard from "./adminComponents/Dashboard";
import Order from "./adminComponents/Order";
import UserManagement from "./adminComponents/Usermanage";
import AdminRoute from "./adminComponents/AdminRoute";
import AdminLogin from "./adminComponents/AdminLogin";
import CreateAdmin from "./adminComponents/AdminSingup";
import AdminMenu from "./adminComponents/Menu";
import AdminTables from "./adminComponents/Tables";
import AddItem from "./adminComponents/AddMenuItem";
import EditItem from "./adminComponents/EditMenu";
import EditBookings from "./adminComponents/EditBookings";
import EditUser from "./adminComponents/EditUser";
import ViewOrder from "./adminComponents/ViewOrder";



const Layout = ({ children, setSearchQuery }) => {
  const location = useLocation();
  const hideLayoutOnPaths = ["/login","/singup"];
  const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);

  return (
    <div className="app-wrapper">  {/* <-- add this wrapper */}
      {!shouldHideLayout && <Navbar setSearchQuery={setSearchQuery} />}
      
      <main className="content-container"> {/* optional: semantic main */}
        {children}
      </main>

      {!shouldHideLayout && <Footer />}
    </div>
  );
};


const AnimateRoutes = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Slider />} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SignUp />} />
        <Route path="/about" element={<AboutFull />} />
        <Route path="/booktable" element={<Tables />} />
        <Route path="/book" element={<BookTable />} />
        <Route path="/book/:tableNo" element={<BookTable />} />
        <Route path="/menu" element={<Menu searchQuery={searchQuery} />} />
        <Route path="/updateprofile" element={<UpdateProfile/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
         <Route path="/admin">
           {/* Protect these using AdminRoute */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Order />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="createAdmin" element={<CreateAdmin />}/>
                <Route path="menu" element={<AdminMenu />}/>
                <Route path="table" element={<AdminTables />} />
                <Route path="menu/addItem" element={<AddItem/>}/>
                <Route path="menu/editItem/:id" element={<EditItem/>}/>
                <Route path="table/editbookings/:id" element={<EditBookings/>}/>
                <Route path="users/edituser/:id" element={<EditUser />} />
                <Route path="orders/vieworder/:id" element={<ViewOrder />} />
               </Route>
            </Route>
              {/* Unprotected login route */}
            <Route path="login" element={<AdminLogin />} />
          </Route> 
    {/* User Routes with Navbar/Footer */}
    <Route
      path="*"
      element={
        <Layout setSearchQuery={setSearchQuery}>
          <AnimateRoutes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Layout>
      }
    />
  </Routes>
</BrowserRouter>

  );
}


export default App;
