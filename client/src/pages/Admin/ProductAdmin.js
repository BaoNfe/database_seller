import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [warehouse, setWarehouse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");

  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product.id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory_id(data.product.category_id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);
  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllWarehouse = async () => {
    try {
      const { data } = await axios.get("/api/v1/warehouse/get-warehouse");
      setWarehouse(data?.warehouse);
      console.log("warehouse:", data);
    } catch (error) {
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  useEffect(() => {
    getAllWarehouse();
  }, []);

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category_id", category_id);
      const { data } = await axios.put(
        `/api/v1/product/update-product/${params.slug}`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
        toast.success("Product Updated Successfully");
        navigate("/products");
      } else {
        toast.error("Product Update Failed");
        navigate("/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  //delete a product
  const handleDelete = async (name) => {
    console.log('Deleting product with ID:', name);
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${name}`
      );
      toast.success("Product DEleted Succfully");
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleMoveProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/move-product", {
        productId: id, // The product ID you want to move
        newWarehouseName: destinationWarehouse, // The name of the destination warehouse
      });

      if (data?.success) {
        toast.success("Product moved to a new warehouse successfully");
        navigate("/products");
      } else {
        toast.error("Product move failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while moving the product");
    }
  };

  return (
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Update Product</h1>
          <div className="m-1 w-75">
            <Select
              bordered={false}
              placeholder="Select a category"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => {
                setCategory_id(value);
              }}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {photo ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={`/api/v1/product/product-photo/${id}`}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder="write a name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                type="text"
                value={description}
                placeholder="write a description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="write a Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder="write a quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <Select
                bordered={false}
                placeholder="Select Shipping "
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setShipping(value);
                }}
                value={shipping ? "yes" : "No"}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleUpdate}>
                UPDATE PRODUCT
              </button>
            </div>
            <div className="mb-3">
              <button className="btn btn-danger" onClick={() => handleDelete(name)}>
                DELETE PRODUCT
              </button>
            </div>
            <div className="mb-3">
            {/* <ToastContainer /> */}
              {/* Select the destination warehouse */}
              <Select
                bordered={false}
                placeholder="Select a destination warehouse"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setDestinationWarehouse(value);
                }}
              >
                {warehouse?.map((w) => (
                  <Option key={w.id} value={w.name}>
                    {w.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              {/* Button to move the product */}
              <button className="btn btn-primary" onClick={handleMoveProduct}>
                MOVE PRODUCT TO NEW WAREHOUSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
