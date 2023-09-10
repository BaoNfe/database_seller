import React, { useState, useEffect } from "react";
import SellerMenu from "../../components/Layout/SellerMenu";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category_id, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [volume, setVolume] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category_id", category_id);
      productData.append("volume", volume);
      productData.append("properties", selectedProperties.join(","));
      const { data } = axios.post(
        "/api/v1/product/create-product",
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/seller/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  
  const getPropertiesForCategory = (categoryName) => {
    const selectedCategory = categories.find((c) => c.name === categoryName);
    return selectedCategory ? selectedCategory.properties : [];
  };

  const handlePropertyValueSelect = (value) => {
    setSelectedProperties([...selectedProperties, value]); // Push the selected value to the array
  };

  

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <SellerMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
             <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setSelectedCategory(value);
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              {selectedCategory && (
                <div className="mb-3">
                  {getPropertiesForCategory(selectedCategory).map(
                    (property) => (
                      <Select
                        key={property.name}
                        bordered={false}
                        placeholder={`Select ${property.name}`}
                        size="large"
                        showSearch
                        className="form-select mb-3"
                        onChange={(value) => {
                          handlePropertyValueSelect(property.name, value);
                        }}
                        value={selectedProperties[property.name]}
                      >
                        {property.values.map((value) => (
                          <Option key={value} value={value}>
                            {value}
                          </Option>
                        ))}
                      </Select>
                    )
                  )}
                </div>
              )}
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
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
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
                <input
                  type="number"
                  value={volume}
                  placeholder="write a Volume"
                  className="form-control"
                  onChange={(e) => setVolume(e.target.value)}
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
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
  );
};

export default CreateProduct;
