import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import slugify from "slugify";
import fs from 'fs';
import db from "../models/index.js";
const sequelize = db.sequelize;
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
export const createProductController = async (req, res) => {
    try {
      const { name, description, price, category_id, quantity } =
        req.fields;
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
        slug: slugify(name),
      });
  
      if (photo) {
        const photoData = fs.readFileSync(photo.path);
        await product.update({ photo: photoData });
      }
  
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
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
      
      const { id, slug , name, description, price, category, quantity, createdAt, updatedAt, photo} = product;

      const photoDataUri = `data:image/jpeg;base64,${photo.toString("base64")}`;
      return {
        id,
        slug,
        name,
        description,
        price,
        category,
        quantity,
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
      const deletedProduct = await Product.destroy({
        where: { id: req.params.pid },
      });
  
      if (deletedProduct === 0) {
        res.status(404).send({
          success: false,
          message: "Product not found",
        });
        return;
      }
  
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
      const { name, description, price, category, quantity } =
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
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "Photo is Required and should be less than 1MB" });
      }
  
      const product = await Product.findByPk(req.params.pid);
  
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
