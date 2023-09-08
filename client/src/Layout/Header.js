import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [cart] = useCart();
  const navigate = useNavigate();

  const handleCartClick = () => {
    // Navigate to the cart page when the cart button is clicked
    navigate("/cart");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              🛒 Ecommerce App
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  <button
                    className="btn btn-primary"
                    onClick={handleCartClick}
                  >
                    Cart
                    <Badge count={cart?.length} showZero offset={[10, -5]} />
                  </button>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
