import React from "react";
import { NavLink } from "react-router-dom";
const SellerMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group">
          <h4>Seller Panel</h4>
          {/* <NavLink
            to="/dashboard/seller/create-category"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </NavLink> */}
          <NavLink
            to="/dashboard/seller/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/seller/products"
            className="list-group-item list-group-item-action"
          >
            Products
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SellerMenu;