const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();

const htmlPath = path.join(__dirname, 'public', 'index.html');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

// Handle API routes
app.post('/create', async (req, res) => {
  try {
    const productId = await db.createProduct(req.body);
    res.json({ insertedId: productId });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
});

const port = 5500; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//IMPORTANT: access the html though http://localhost:5500