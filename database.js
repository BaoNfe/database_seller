const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://s3852307:admin123@cluster0.xtry92d.mongodb.net/'; 
const dbName = 'ecommerce';     // Replace with your database name

async function connect() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


// CREATE
async function createProduct(product) {
  const db = await connect();
  const productsCollection = db.collection('products');

  const result = await productsCollection.insertOne(product);
  return result.insertedId;
}

// READ
async function getProduct(productId) {
  const db = await connect();
  const productsCollection = db.collection('products');

  const product = await productsCollection.findOne({ _id: productId });
  return product;
}

// UPDATE
async function updateProduct(productId, updates) {
  const db = await connect();
  const productsCollection = db.collection('products');

  const result = await productsCollection.updateOne({ _id: productId }, { $set: updates });
  return result.modifiedCount;
}

// DELETE
async function deleteProduct(productId) {
  const db = await connect();
  const productsCollection = db.collection('products');

  const result = await productsCollection.deleteOne({ _id: productId });
  return result.deletedCount;
}

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
