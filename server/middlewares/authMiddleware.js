import JWT from "jsonwebtoken";
import UserModel from "../models/userModel_MySQL.js";
import db from "../models/index.js";

const User = UserModel(db.sequelize);

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//Seller acceess
export const isSeller = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in seller middelware",
    });
  }
};