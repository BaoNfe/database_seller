import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to get cart items from local storage
  const getCartItemsFromLocalStorage = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
  };

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      console.log("Here's cart in the CartPage", cart);
      cart?.map((item) => {
        const realPrice = parseInt(item.price);
        console.log("Here's the price in the CartPage", parseInt(item.price))
        total = total + realPrice * item.amount;
        console.log("Here's the total in the CartPage", total)
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (productId) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === productId);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Fetch cart items from local storage when the component mounts
  useEffect(() => {
    getCartItemsFromLocalStorage();
  }, []);

  return (
    <div className="cart-page">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center bg-light p-2 mb-1">
            <p className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart `
                : " Your Cart Is Empty"}
            </p>
          </h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-7 p-0 m-0">
            {cart?.map((product) => (
              <div className="row card flex-row" key={product.id}>
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${product.id}`}
                    className="card-img-top"
                    alt={product.name}
                    width="100%"
                    height="130px"
                  />
                </div>
                <div className="col-md-4">
                  <p>{product.name}</p>
                  <p>{product.description.substring(0, 30)}</p>
                  <p>Price: {product.price}</p>
                </div>
                <div className="col-md-4 cart-remove-btn">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-5 cart-summary">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>
            <div className="mt-2">
              <button
                className="btn btn-primary"
                onClick={handlePayment}
                disabled={loading || !cart?.length}
              >
                {loading ? "Processing ...." : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
