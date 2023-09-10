import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import SellerMenu from "../../components/Layout/SellerMenu";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState([]);
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [totalAreaVolume, setTotalArea] = useState("");
  const [availableAreaVolume, setAvailableArea] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handlewarehouseCreate = async (e) => {
    e.preventDefault();
    try {
      const warehouseData = new FormData();
      warehouseData.append("name", name);
      warehouseData.append("province", province);
      warehouseData.append("city", city);
      warehouseData.append("district", district);
      warehouseData.append("street", street);
      warehouseData.append("number", number);
      warehouseData.append("totalAreaVolume", totalAreaVolume);
      warehouseData.append("availableAreaVolume", totalAreaVolume);
      const { data } = axios.post(
        "/api/v1/warehouse/create-warehouse",
        warehouseData
      );
      if (data?.success) {
        toast.success("warehouse Created Successfully");
        getAllWarehouse();
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

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

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.put(
  //       `/api/v1/warehouse//update-warehouse/${selected.id}`,
  //       { name: updatedName }
  //     );
  //     if (data?.success) {
  //       toast.success(`${updatedName} is updated`);
  //       setSelected(null);
  //       setUpdatedName("");
  //       setVisible(false);
  //       getAllWarehouse();
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDelete = async (name) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/warehouse/delete-warehouse/${name}`
      );
      if (data.success) {
        toast.success(`warehouse is deleted`);

        getAllWarehouse();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }
  };

  return (
    <Layout>
    <div className="container-fluid m-3 p-3 dashboard">
      <div className="row">
        <div className="col-md-3">
          <SellerMenu />
        </div>
        <div className="col-md-9">
          <h1>Create warehouse</h1>
          <div className="m-1 w-75">
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
              <input
                type="text"
                value={province}
                placeholder="write a Province"
                className="form-control"
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={city}
                placeholder="write a City"
                className="form-control"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={district}
                placeholder="write a district"
                className="form-control"
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={street}
                placeholder="write a street"
                className="form-control"
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={number}
                placeholder="write a number"
                className="form-control"
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={totalAreaVolume}
                placeholder="write a total area"
                className="form-control"
                onChange={(e) => setTotalArea(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button
                className="btn btn-primary"
                onClick={handlewarehouseCreate}
              >
                CREATE warehouse
              </button>
            </div>
          </div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouse?.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <div>
                        {c.name} <br />
                        {"address: "}
                        {c.province} {c.city} {c.district} {c.street} {c.number} <br />
                        {"Total volumn: "}{c.totalAreaVolume} {c.availableAreaVolume}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => {
                          navigate(`/update-warehouse/${c.slug}`)
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-primary ms-2" onClick={() => handleDelete(c.name)}>delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default CreateWarehouse;
