import express from "express";
import { OrderAccept,
  OrderControl,
 } from "../controller/orderController.js";

 const router = express.Router();

 //routes
router.post(
    "/place-order",
    OrderControl
  );

router.put(
  "/place-order/:id",
  OrderAccept
)
  
  export default router;