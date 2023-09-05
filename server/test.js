import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import db from "./models/index.js";
import warehouseRoutes from './routes/warehouseRoute.js';
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoute.js'

// Configure environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/category", categoryRoutes);
app.use('/api/v1/warehouse', warehouseRoutes);
app.use("/api/v1/product", productRoutes);

// REST API
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the eCommerce app</h1>');
});

// PORT
const PORT = process.env.PORT || 8080;

// Start the server
db.sequelize.sync()
    app.listen(PORT, () => {
        // console.log(`Server Running on ${process.env.DEV_MODE} mode.`);
        // console.log(`MongoDB Server Running on Port ${MONGO_PORT}`.bgCyan.white);
        console.log(`MySQL Server Running on Port ${PORT}`.bgGreen.white);
    });

