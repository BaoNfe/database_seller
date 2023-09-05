import { Routes, Route } from "react-router-dom";
import CreateWarehouse from "./pages/Admin/createWarehouse.js";
import CreateCategory from "./pages/Admin/CreateCategory.js";
import CreateProduct from "./pages/Admin/CreateProduct.js";
import UpdateProduct from "./pages/Admin/UpdateProduct.js";
// import HomePage from "./HomePage.js";
import Products from "./pages/Admin/Products.js";
import AdminMenu from "./Layout/AdminMenu.js";
function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<AdminMenu />} />
          <Route path="/products" element={<Products />} />
          <Route path="/create-warehouse" element={<CreateWarehouse />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/product/:slug" element={<UpdateProduct />} />
      </Routes>
    </>
  );
}

export default App;
