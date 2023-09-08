import React, { useState, useEffect } from "react";
import AdminMenu from "../../Layout/AdminMenu.js";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const UpdateWareHouse = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [warehouse, setWarehouse] = useState([]);
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [totalAreaVolume, setTotalArea] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    const getSingleWarehouse = async () => {
        try {
            const { data } = await axios.get(
                `/api/v1/warehouse/get-warehouse/${params.slug}`
            );
            setName(data.warehouse.name);
            setProvince(data.warehouse.province);
            setCity(data.warehouse.city);
            setDistrict(data.warehouse.district)
            setStreet(data.warehouse.street)
            setNumber(data.warehouse.number)
            setTotalArea(data.warehouse.totalAreaVolume)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getSingleWarehouse();
        //eslint-disable-next-line
    }, []);
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const warehouseData = new FormData();
            warehouseData.append("name", name);
            warehouseData.append("id", id);
            warehouseData.append("province", province);
            warehouseData.append("city", city);
            warehouseData.append("district", district);
            warehouseData.append("street", street);
            warehouseData.append("number", number);
            warehouseData.append("totalAreaVolume", totalAreaVolume);
            const { data } = await axios.put(
                `/api/v1/warehouse/update-warehouse/${params.slug}`,
                warehouseData
            );
            if (data?.success) {
                toast.error(data?.message);
                toast.success("warehouse Updated Successfully");
                navigate("/create-warehouse");
            } else {
                toast.error("Product Update Failed");
                navigate("/create-warehouse");
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    };
    return (
        <div className="container-fluid m-3 p-3 dashboard">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1>UPDATE warehouse</h1>
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
                    onClick={handleUpdate}
                  >
                    UPDATE warehouse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default UpdateWareHouse