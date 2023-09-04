import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import sequelize  from './models/warehouseModel.js'; // Import sequelize and models

import warehouseRoutes from './routes/warehouseRoute.js';

// Configure environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/warehouse', warehouseRoutes);

// REST API
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the eCommerce app</h1>');
});

// PORT
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});

// Create the MySQL table using Sequelize.sync
sequelize.sync()
  .then(() => {
    console.log('All tables synchronized successfully');
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });
