// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Checkbox, Radio } from "antd";
// import { Prices } from "../components/Prices";
// import { useCart } from "../context/cart";
// import Layout from "../Layout/Layout.js";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../styles/Homepage.css";

// const HomePage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useCart();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [checked, setChecked] = useState([]);
//   const [radio, setRadio] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Get all categories
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/category/get-category");
//       if (data?.success) {
//         setCategories(data?.category);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//     // getTotal();
//   }, []);

//   // Get products
//   const getAllProducts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
//       setLoading(false);
//       setProducts(data.products);
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//     }
//   };

//   // Get total count
//   // const getTotal = async () => {
//   //   try {
//   //     const { data } = await axios.get("/api/v1/product/product-count");
//   //     setTotal(data?.total);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (page === 1) return;
//   //   loadMore();
//   // }, [page]);

//   // // Load more
//   // const loadMore = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
//   //     setLoading(false);
//   //     setProducts([...products, ...data?.products]);
//   //   } catch (error) {
//   //     console.log(error);
//   //     setLoading(false);
//   //   }
//   // };

//   // Filter by category
//   // const handleFilter = (value, id) => {
//   //   let all = [...checked];
//   //   if (value) {
//   //     all.push(id);
//   //   } else {
//   //     all = all.filter((c) => c !== id);
//   //   }
//   //   setChecked(all);
//   // };

//   // useEffect(() => {
//   //   if (!checked.length || !radio.length) getAllProducts();
//   // }, [checked.length, radio.length]);

//   // useEffect(() => {
//   //   if (checked.length || radio.length) filterProduct();
//   // }, [checked, radio]);

//   // // Get filtered products
//   // const filterProduct = async () => {
//   //   try {
//   //     const { data } = await axios.post("/api/v1/product/product-filters", {
//   //       checked,
//   //       radio,
//   //     });
//   //     setProducts(data?.products);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   return (
//     <Layout>
//     <div className="container-fluid row mt-3 home-page">
//       <div className="col-md-3 filters">
//         <h4 className="text-center">Filter By Category</h4>
//         {/* <div className="d-flex flex-column">
//           {categories?.map((c) => (
//             <Checkbox
//               key={c._id}
//               onChange={(e) => handleFilter(e.target.checked, c.name)}
//             >
//               {c.name}
//             </Checkbox>
//           ))}
//         </div> */}
//         {/* Price filter */}
//         <h4 className="text-center mt-4">Filter By Price</h4>
//         {/* <div className="d-flex flex-column">
//           <Radio.Group onChange={(e) => setRadio(e.target.value)}>
//             {Prices?.map((p) => (
//               <div key={p._id}>
//                 <Radio value={p.array}>{p.name}</Radio>
//               </div>
//             ))}
//           </Radio.Group>
//         </div> */}
//         {/* <div className="d-flex flex-column">
//           <button
//             className="btn btn-danger"
//             onClick={() => window.location.reload()}
//           >
//             RESET FILTERS
//           </button>
//         </div> */}
//       </div>
//       <div className="col-md-9 ">
//         <h1 className="text-center">All Products</h1>
//         <div className="d-flex flex-wrap">
//           {products?.map((p) => (
//             <div className="card m-2" key={p._id}>
//               <img
//                 src={`/api/v1/product/product-photo/${p._id}`}
//                 className="card-img-top"
//                 alt={p.name}
//               />
//               <div className="card-body">
//                 <div className="card-name-price">
//                   <h5 className="card-title">{p.name}</h5>
//                   <h5 className="card-title card-price">
//                     {p.price.toLocaleString("en-US", {
//                       style: "currency",
//                       currency: "USD",
//                     })}
//                   </h5>
//                 </div>
//                 <p className="card-text ">
//                   {p.description.substring(0, 60)}...
//                 </p>
//                 <div className="card-name-price">
//                   <button
//                     className="btn btn-info ms-1"
//                     onClick={() => navigate(`/product/${p.slug}`)}
//                   >
//                     More Details
//                   </button>
//                   <button
//                     className="btn btn-dark ms-1"
//                     onClick={() => {
//                       setCart([...cart, p]);
//                       localStorage.setItem("cart", JSON.stringify([...cart, p]));
//                       toast.success("Item Added to cart");
//                     }}
//                   >
//                     ADD TO CART
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="m-2 p-3">
//           {products && products.length < total && (
//             <button
//               className="btn loadmore"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setPage(page + 1);
//               }}
//             >
//               {loading ? "Loading ..." : <>Loadmore</>}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//     </Layout>
//   );
// };

// export default HomePage;


import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Homepage.css";
import Layout from "antd/es/layout/layout";
import { Badge } from "antd"

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartDataForServer, setCartDataForServer] = useState([]); // State to store cart data for server

  // Get products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

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

  return (
    <div>
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
      </div>
    </div>
  );
};

export default HomePage;
