  import React, { useState, useEffect } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import axios from "axios";
  import toast from "react-hot-toast";
  import "../styles/CartStyles.css";

  const OrderPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const { id } = useParams();

    // Function to get cart items from local storage
    const getCartItemsFromLocalStorage = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cartItems);
    };

    const totalPrice = () => {
      try {
        let total = 0;
        cart?.forEach((item) => {
          const realPrice = parseInt(item.price);
          total = total + realPrice * item.amount;
        });
        return total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      getCartItemsFromLocalStorage();
    }, []);


    const handleAcceptOrder = async () => {
      try {
        const response = await axios.put(`/api/v1/order/place-order/${id}`, {
          action: 'accept', // 'accept' or 'reject'
        });
  
        if (response.data.success) {
          console.log(`Order Accepted Successfully`);
          // You can update the UI to reflect the changed order status here
        } else {
          console.error('Failed to accept order');
        }
      } catch (error) {
        console.error('Error accepting order:', error);
      }
    };

    const handleRejectOrder = async () => {
      try {
        const response = await axios.put(`/api/v1/order/place-order/${id}`, {
          action: 'reject', // 'accept' or 'reject'
        });
  
        if (response.data.success) {
          console.log(`Order Rejected Successfully`);
          navigate("/")
        } else {
          console.error('Failed to accept order');
        }
      } catch (error) {
        console.error('Error accepting order:', error);
      }
    };
    
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
                    <p>Amount: {product.amount}</p>
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
                <div className="mt-2">
                <button onClick={handleAcceptOrder}>Accept Order</button>
                  <button onClick={handleRejectOrder}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default OrderPage;
