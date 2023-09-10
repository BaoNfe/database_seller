// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from "react-hot-toast";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartDataForServer, setCartDataForServer] = useState([]);

  useEffect(() => {
    // Load cart data from localStorage when the component mounts
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, []);

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its amount
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].amount += 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item amount updated in cart");
    } else {
      // If the item doesn't exist, add it to the cart
      const newItem = { ...product, amount: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      toast.success("Item added to cart");
    }

    setCartDataForServer([...cart, { id: product.id, amount: product.amount || 1 }]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
