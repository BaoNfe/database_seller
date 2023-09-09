import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controller/authController_MySQL.js"
import { isSeller, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isSeller, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Seller route auth
router.get("/seller-auth", requireSignIn, isSeller, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;