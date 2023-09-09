import { Routes, Route } from "react-router-dom";
import React from "react";
import CreateWarehouse from "./pages/Admin/createWarehouse.js";
import CreateCategory from "./pages/Admin/CreateCategory.js";
import CreateProduct from "./pages/Admin/CreateProduct.js";
import UpdateProduct from "./pages/Admin/UpdateProduct.js";
import HomePage from "./pages/HomePage.js";
import Products from "./pages/Admin/Products.js";
import OrderPage from "./pages/OrderPage.js";
import UpdateWareHouse from "./pages/Admin/UpdateWarehouse.js";
import CartPage from "./pages/CartPage.js";
import SellerRoute from "./components/Routes/SellerRoute.js";
import SellerDashboard from "./pages/Admin/SellerDashboard.js";
import Users from "./pages/Admin/Users.js";
import PrivateRoute from "./components/Routes/Private.js"
import Dashboard from "./pages/user/Dashboard.js"
import Profile from "./pages/user/Profile.js"
import Register from "./pages/Auth/Register.js"
import Login from "./pages/Auth/Login.js"
import ProductDetails from "./pages/ProductDetails.js";
import Category from "./pages/Categories.js";
import Search from "./pages/Search.js"
import Pagenotfound from "./pages/Pagenotfound.js"
function App() {
  return (
    <>
      <Routes>
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="user" element={<Dashboard />} />
        <Route path="user/orders" element={<OrderPage />} />
        <Route path="user/profile" element={<Profile />} />
      </Route>
      <Route path="/dashboard" element={<SellerRoute />}>
        <Route path="seller" element={<SellerDashboard />} />
        <Route path="seller/create-category" element={<CreateCategory />} />
        <Route path="seller/create-product" element={<CreateProduct />} />
        <Route path="seller/product/:slug" element={<UpdateProduct />} />
        <Route path="seller/products" element={<Products />} />
        <Route path="seller/users" element={<Users />} />
      </Route>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
