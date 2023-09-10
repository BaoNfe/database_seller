import { Op } from "sequelize";
import db from "../models/index.js";
import CategoryModel from "../models/categoryModel.js";
import {Categories} from "../models/Mongo_cate_model.js"

import slugify from "slugify";
const sequelize = db.sequelize;
const Category = CategoryModel(sequelize);

export const syncData = async () => {
  try {
    // Fetch data from MongoDB
    const mongoData = await Categories.find(); // Replace with your MongoDB model
    console.log(mongoData);

    // Fetch parent data from MongoDB
    const parentData = await Categories.find({ _id: { $in: mongoData.map(item => item.parent) } });

    // Create a map for fast look-up of parent names by ObjectId
    const parentNameMap = {};
    parentData.forEach(parent => {
      parentNameMap[parent._id.toString()] = parent.name;
    });
    
    const transformData= mongoData.map((item) => ({
      name: item.name, // Map MongoDB fields to MySQL fields
      slug: item.name,
      parent: item.parent ? parentNameMap[item.parent.toString()] : null, // Use parent name
      properties: item.properties.map((property) => ({
        name: property.name,
        values: property.values,
      })),
    }))

    // Synchronize MongoDB data to MySQL
    await Category.bulkCreate(
      transformData,
      { updateOnDuplicate: ["name", "slug", "parent", "properties"] }
    ); // Update existing records by name and slug

    console.log("Data synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing data:", error);
  }
};


export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await Category.findOne({
      where: { name: { [Op.eq]: name } },
    });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exists",
      });
    }
    const category = await Category.create({
      name,
      slug: slugify(name),
    });
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { name: categoryName } = req.params;
    const [updatedRows] = await Category.update(
      { name, slug: slugify(name) },
      { where: { name: categoryName } }
    );
    if (updatedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    const category = await Category.findByPk(name);
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    console.log(name);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
    });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { name } = req.params;
    const deletedRows = await Category.destroy({ where: { name } });
    if (deletedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
