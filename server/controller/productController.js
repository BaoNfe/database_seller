import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import warehouseModel from "../models/warehouseModel.js";
import slugify from "slugify";
import fs from 'fs';
import db from "../models/index.js";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const sequelize = db.sequelize;
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Warehouse = warehouseModel(sequelize)

const callUpdateProductWarehouse = async (productName, productQuantity) => {
  await sequelize.query('CALL UpdateProductWarehouse(?, ?)', {
    replacements: [productName, productQuantity],
  });
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category_id, quantity, volume } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name) {
      return res.status(500).send({ error: "Name is Required" });
    }
    if (!description) {
      return res.status(500).send({ error: "Description is Required" });
    }
    if (!price) {
      return res.status(500).send({ error: "Price is Required" });
    }
    if (!category_id) {
      return res.status(500).send({ error: "Category is Required" });
    }
    if (!quantity) {
      return res.status(500).send({ error: "Quantity is Required" });
    }
    if (!volume) {
      return res.status(500).send({ error: "Volume is Required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(500)
        .send({ error: "Photo is Required and should be less than 1MB" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      quantity,
      volume,
      slug: slugify(name),
    });

    if (photo) {
      const photoData = fs.readFileSync(photo.path);
      await product.update({ photo: photoData });
    }
    await callUpdateProductWarehouse(name, quantity);
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
      message: "Error in creating product",
    });
  }
};
//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await Product.findAll();

    // Create a modified products array with base64 photo data
    const productsWithPhoto = products.map((product) => {
      const { id, slug, name, description, price,volume, category_id, quantity, createdAt, updatedAt, photo } = product;

      // Check if the photo field exists and is not null
      const photoDataUri = photo ? `data:image/jpeg;base64,${photo.toString("base64")}` : null;

      return {
        id,
        slug,
        name,
        description,
        price,
        category_id,
        quantity,
        volume,
        createdAt,
        updatedAt,
        photo: photoDataUri,
      };
    });

    res.status(200).send({
      success: true,
      countTotal: productsWithPhoto.length,
      message: "All Products",
      products: productsWithPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });

    if (product && product.photo) {
      // Convert the binary photo data to a Base64 data URI
      const photoDataUri = `data:image/jpeg;base64,${product.photo.toString("base64")}`;

      // Create a modified product object with the photo as a data URI
      const productWithPhotoDataUri = {
        ...product.toJSON(),
        photo: photoDataUri,
      };

      return res.status(200).send({
        success: true,
        product: productWithPhotoDataUri,
      });
    }

    res.status(404).send({
      success: false,
      message: "Product not found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};
// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.pid, {
      attributes: ["photo"],
    });

    if (!product || !product.photo) {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }

    // Send the image as a response with appropriate headers
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    // Send the binary image data as-is
    res.end(product.photo);

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error: error.message,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    const { name } = req.params;

    // Find the product by its name
    const product = await Product.findOne({ where: { name } });

    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
      return;
    }

    // Calculate the volume of the product to be deleted
    const volumeToDelete = product.quantity * product.volume;

    // Retrieve the current warehouse of the product
    const currentWarehouseName = product.warehouse;

    // Update the availableAreaVolume of the current warehouse by adding the volume to delete
    await Warehouse.update(
      {
        availableAreaVolume: sequelize.literal(`availableAreaVolume + ${volumeToDelete}`),
      },
      {
        where: { name: currentWarehouseName },
      }
    );

    // Delete the product
    await Product.destroy({
      where: { name },
    });

    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};
//upate product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category_id, quantity } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category_id:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1MB" });
    }

    const { slug } = req.params;

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
      return;
    }

    const updatedProduct = await product.update(
      { ...req.fields, slug: slugify(name) },
      { returning: true }
    );

    if (photo) {
      updatedProduct.photo.data = fs.readFileSync(photo.path);
      updatedProduct.photo.contentType = photo.type;
    }

    await updatedProduct.save();

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};
// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, sortPrice, sortCreatedTime } = req.body;
    let where = {};

    if (checked.length > 0) {
      where.categoryId = checked;
    }

    let order = [];

    if (sortPrice === "asc") {
      order.push(["price", "ASC"]);
    } else if (sortPrice === "desc") {
      order.push(["price", "DESC"]);
    }

    if (sortCreatedTime === "asc") {
      order.push(["createdTime", "ASC"]);
    } else if (sortCreatedTime === "desc") {
      order.push(["createdTime", "DESC"]);
    }

    const products = await Product.findAll({
      where,
      include: [Category],
      order,
    });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error: error.message,
    });
  }
};
// product count
export const productCountController = async (req, res) => {
  try {
    const total = await Product.count();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error: error.message,
      success: false,
    });
  }
};
// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? parseInt(req.params.page) : 1;

    const offset = (page - 1) * perPage;

    const products = await Product.findAll({
      attributes: { exclude: ['photo'] },
      limit: perPage,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in pagination",
      error: error.message,
    });
  }
};
// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const results = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      },
      attributes: { exclude: ['photo'] },
    });

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error: error.message,
    });
  }
};
// similar products
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await Product.findAll({
      where: {
        category_id: cid,
        product_id: {
          [Op.ne]: pid,
        },
      },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      attributes: { exclude: ["photo"] },
      limit: 3,
    });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error: error.message,
    });
  }
};
export const moveProductController = async (req, res) => {
  try {
    const { productId, newWarehouseName } = req.body;

    // Find the product by its ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found',
      });
    }

    const currentWarehouseName = product.warehouse;

    // Check if the new warehouse exists
    const newWarehouse = await Warehouse.findOne({ where: { name: newWarehouseName } });

    if (!newWarehouse) {
      return res.status(404).send({
        success: false,
        message: 'New warehouse not found',
      });
    }

    // Calculate the volume to be moved
    const volumeToMove = product.quantity * product.volume;

    // Check if there's enough available space in the new warehouse
    if (newWarehouse.availableAreaVolume < volumeToMove) {
      //toast.error('Not enough available space in the new warehouse');
      console.log(newWarehouse)
      return res.status(400).send({  
        success: false,
        message: 'Not enough available space in the new warehouse',
      });
    }

    // Perform the move within a transaction
    await sequelize.transaction(async (t) => {
      // Decrease the quantity in the current warehouse
      await Product.decrement('quantity', {
        by: product.quantity,
        where: { id: productId },
        transaction: t,
      });

      // Update the warehouse of the product
      await product.update({ warehouse: newWarehouseName }, { transaction: t });

      // Increase the quantity in the new warehouse
      await Product.increment('quantity', {
        by: product.quantity,
        where: { id: productId },
        transaction: t,
      });

      // Update the availableVolume of the original warehouse (subtract the volume to move)
      await Warehouse.update(
        {
          availableAreaVolume: sequelize.literal(`availableAreaVolume + ${volumeToMove}`),
        },
        {
          where: { name: currentWarehouseName },
          transaction: t,
        }
      );

      // Update the availableVolume of the new warehouse (add the volume to move)
      await Warehouse.update(
        {
          availableAreaVolume: sequelize.literal(`availableAreaVolume - ${volumeToMove}`),
        },
        {
          where: { name: newWarehouseName },
          transaction: t,
        }
      );
    });

    res.status(200).send({
      success: true,
      message: 'Product moved to a new warehouse successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while moving product',
      error: error.message,
    });
  }
};

// export const cartItemsController = (req, res) => {
//   try {
//     // Retrieve cart items from local storage
//     const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

//     // Send the cart items to the client
//     res.status(200).send({
//       success: true,
//       cartItems,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while retrieving cart items",
//       error: error.message,
//     });
//   }
// };

export const updatedCartItems = async (req, res) => {
  const { cart } = req.body;

  try {
    // Start a Sequelize transaction
    await sequelize.transaction(async (t) => {
      // Iterate through the cart items and update the server's database
      for (const cartItem of cart) {
        const { id, amount } = cartItem;

        // Find the product by its ID in the database and lock it for the transaction
        const product = await Product.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });

        // Check if there is enough quantity available in the database
        if (product.quantity < amount) {
          return res.status(400).json({ success: false, message: 'Insufficient product quantity' });
        }

        // Deduct the specified quantity from the product's quantity
        // product.quantity -= amount;
        // await product.save({ transaction: t });
      }
    });

    // Respond with a success message
    res.status(200).json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const removeCartItems = async (req, res) => {
  const { cart } = req.body;

  try {
    // Start a Sequelize transaction
    await sequelize.transaction(async (t) => {
      // Iterate through the cart items and update the server's database
      for (const cartItem of cart) {
        const { id, amount } = cartItem;

        // Find the product by its ID in the database and lock it for the transaction
        const product = await Product.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });

        // Add the specified quantity back to the product's quantity
        // product.quantity += amount;
        // await product.save({ transaction: t });
      }
    });

    // Respond with a success message
    res.status(200).json({ success: true, message: 'Cart items removed successfully' });
  } catch (error) {
    console.error('Error removing cart items:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const OrderAccept = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a Sequelize transaction
    await sequelize.transaction(async (t) => {
      // Update the order status to 'Accept' in the database
      await Order.update(
        { status: 'Accept' },
        {
          where: {
            id: id,
          },
          transaction: t,
        }
      );

      // The trigger and stored procedure will handle updating product quantities
      // There is no need to manually update product quantities here

      // Respond with a success message
      res.status(200).json({ success: true, message: 'Order accepted successfully' });
    });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//get product by category
export const productCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ where: { slug } });

    const products = await Product.findAll({
      where: { category_id: category.id },
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};
