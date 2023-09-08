import { Routes, Route } from "react-router-dom";
import React from "react";
import CreateWarehouse from "./pages/Admin/createWarehouse.js";
import CreateCategory from "./pages/Admin/CreateCategory.js";
import CreateProduct from "./pages/Admin/CreateProduct.js";
import UpdateProduct from "./pages/Admin/UpdateProduct.js";
import HomePage from "./pages/HomePage.js";
import Products from "./pages/Admin/Products.js";
import AdminMenu from "./Layout/AdminMenu.js";
import UpdateWareHouse from "./pages/Admin/UpdateWarehouse.js";
import CartPage from "./pages/CartPage.js";
function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/create-warehouse" element={<CreateWarehouse />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/update-warehouse/:slug" element={<UpdateWareHouse />} />
          <Route path="/product/:slug" element={<UpdateProduct />} />
      </Routes>
    </>
  );
}

export default App;
