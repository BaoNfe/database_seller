import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB_Mongo, connectDB_MySQL } from "./config/db.js"; // Import your database connection functions
import db from "./models/index.js"; // Import your Sequelize models
import warehouseRoutes from "./routes/warehouseRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import userRoute from "./routes/authRoutes_MySQL.js";
import { syncData } from "./controller/categoryController.js";
import schedule from "node-schedule";
import mongoose from 'mongoose';

// Configure environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB_Mongo();

const createTables = async () => {
  try {
    await db.sequelize.sync();
    console.log("MySQL tables are synchronized.");
  } catch (error) {
    console.error("Error synchronizing MySQL tables:", error);
  }
};

// Start the server
const startServer = async () => {
  try {
    // Connect to MySQL
    const connection = await connectDB_MySQL();

    // Create MySQL tables if they don't exist
    await createTables();

    // Routes
    app.use("/api/v1/category", categoryRoutes);
    app.use("/api/v1/warehouse", warehouseRoutes);
    app.use("/api/v1/product", productRoutes);
    app.use("/api/v1/order", orderRoute);
    app.use("/api/v1/auth", userRoute);

    // REST API
    app.get("/", (req, res) => {
      res.send("<h1>Welcome to the eCommerce app</h1>");
    });

    schedule.scheduleJob("*/5 * * * *", syncData);

    // Listen for MongoDB connection events
    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB");
      // Start data synchronization when MongoDB connection is open
      syncData();
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
    // PORT
    const PORT = process.env.PORT || 8080;

    // Start the server
    app.listen(PORT, () => {
      console.log(
        `MySQL and MongoDB servers are running on Port ${PORT}`.bgGreen.white
      );
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Start the server
startServer();
