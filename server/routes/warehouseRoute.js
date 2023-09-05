import express from "express";
import {
  getWareHousesController,
  createWareHouseController,
  deleteWarehouseController,
  updateWareHouseController,
} from "../controller/warehouseController.js";
import formidable from 'express-formidable';
const router = express.Router();

// Create Warehouse
router.post(
  "/create-warehouse",
  formidable(),
  createWareHouseController
);

// Update Warehouse by name
router.put(
  "/update-warehouse/:name",
  formidable(),
  updateWareHouseController
);

// Get all Warehouses
router.get("/get-warehouse", getWareHousesController); // /get-warehouses


// Delete Warehouse by Name
router.delete("/delete-warehouse/:name", deleteWarehouseController); // /delete-warehouse


export default router;
