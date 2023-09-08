import express from "express";
import {
  getWareHousesController,
  createWareHouseController,
  deleteWarehouseController,
  updateWareHouseController,
  getSingleWareHouse,
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
  "/update-warehouse/:slug",
  formidable(),
  updateWareHouseController
);

// Get all Warehouses
router.get("/get-warehouse", getWareHousesController); // /get-warehouses

//get single warehouse
router.get("/get-warehouse/:slug", getSingleWareHouse)

// Delete Warehouse by Name
router.delete("/delete-warehouse/:name", deleteWarehouseController); // /delete-warehouse


export default router;
