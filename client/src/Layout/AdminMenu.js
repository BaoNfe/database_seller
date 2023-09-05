import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group dashboard-menu">
          <h4>Admin Panel</h4>
          <NavLink
            to="/create-category"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </NavLink>
          <NavLink
            to="/create-warehouse"
            className="list-group-item list-group-item-action"
          >
            Create warehouse
          </NavLink>
          <NavLink
            to="/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/products"
            className="list-group-item list-group-item-action"
          >
            Products
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
