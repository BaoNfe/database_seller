import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import {toast} from "react-hot-toast";
import "../styles/Homepage.css";
import { Checkbox, Radio } from "antd";
import { useCart } from "../context/cart";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortPrice, setSortPrice] = useState("asc");
  const [sortCreatedTime, setSortCreatedTime] = useState("asc");
  const [cartDataForServer, setCartDataForServer] = useState([]); // State to store cart data for server


  const handleSortPrice = (e) => {
    setSortPrice(e.target.value);
  };

  const handleSortCreatedTime = (e) => {
    setSortCreatedTime(e.target.value);
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      console.log(data)
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

    //getTOtal COunt
    const getTotal = async () => {
      try {
        const { data } = await axios.get("/api/v1/product/product-count");
        setTotal(data?.total);
      } catch (error) {
        console.log(error);
      }
    };


    useEffect(() => {
      if (page === 1) return;
      loadMore();
    }, [page]);
    //load more
    const loadMore = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
        setLoading(false);
        setProducts([...products, ...data?.products]);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };


      // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length) getAllProducts();
  }, [checked.length]);

  useEffect(() => {
    if (checked.length|| sortPrice.length || sortCreatedTime.length) filterProduct();
  }, [checked, sortPrice, sortCreatedTime]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        sortPrice,
        sortCreatedTime,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      console.log("hererdata",data)
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };


  const handleCartClick = async () => {
    // Send the cart data to the server when the cart is clicked
    try {
      await axios.post("/api/v1/product/update-cart", {
        cart: cartDataForServer, // Send the cart data to the server
      });
    } catch (error) {
      console.error("Error updating cart on the server:", error);
      // Handle the error accordingly
    }

    navigate("/cart");
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // If the item already exists in the cart, update its amount in the client-side state
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, amount: item.amount + 1 } // Increment the amount
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Item amount updated in cart");
    } else {
      // If the item is not in the cart, add it with an initial amount of 1
      const newItem = { ...product, amount: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      toast.success("Item added to cart");
    }

    // Update the cart data for the server
    setCartDataForServer([...cart, { id: product.id, amount: product.amount || 1 }]);
  };
  console.log(products, categories)
  return (
    <Layout title={"ALl Products - Best offers "}>
    <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c.id}
                onChange={(e) => handleFilter(e.target.checked, c.id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Sort By Price:</h4>
          <div className="d-flex flex-column">
            <Radio.Group value={sortPrice} onChange={handleSortPrice}>
              <Radio.Button value="asc">Ascending</Radio.Button>
              <Radio.Button value="desc">Descending</Radio.Button>
            </Radio.Group>
          </div>
          <h3 className="text-center mt-4" >Sort By Created Time:</h3>
          <div className="d-flex flex-column">
            <Radio.Group value={sortCreatedTime} onChange={handleSortCreatedTime}>
              <Radio.Button value="asc">Ascending</Radio.Button>
              <Radio.Button value="desc">Descending</Radio.Button>
            </Radio.Group>
            </div>  


          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-12">
          <h1 className="text-center">All Products</h1>
        </div>
        <div className="col-md-12 d-flex flex-wrap">
          {products?.map((p) => (
            <div className="card m-2" key={p.id}>
              <img
                src={`/api/v1/product/product-photo/${p.id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button className="btn btn-secondary ms-1"
                  onClick={() => addToCart(p)}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
                  <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div>
      </div>
    </div>    
    </Layout>
  );
};

export default HomePage;

