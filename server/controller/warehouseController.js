import warehouseModel from '../models/warehouseModel.js';
import db from "../models/index.js";
import { Op } from "sequelize";
import slugify from "slugify"; // Assuming the Sequelize model is named Warehouse
import dotenv from 'dotenv'
import e from 'express';
import ProductModel from '../models/productModel.js';


const sequelize = db.sequelize;
const Warehouse = warehouseModel(sequelize);
const Product = ProductModel(sequelize)
dotenv.config();
export const createWareHouseController = async (req, res) => {
    try {
        const {name, province, city, district, street, number, totalAreaVolume, availableAreaVolume} = 
        req.fields;

        switch(true) {
            case !name:
                return res.status(500).send({error: "name is require"})
            case !province:
                return res.status(500).send({error: "province is require"})
            case !city:
                return res.status(500).send({error: "city is require"})
            case !district:
                return res.status(500).send({error: "district is require"})
            case !street:
                return res.status(500).send({error: "street is require"})
            case !number:
                return res.status(500).send({error: "number is require"})
            case !totalAreaVolume:
                return res.status(500).send({error: "Area is require"})
        }

        const existingWarehouse = await Warehouse.findOne({
            where: { name },
        });

        if (existingWarehouse) {
            return res.status(400).json({
                success: false,
                error: "Warehouse with this name already exists",
            });
        }
        const warehouse = await Warehouse.create({
            name,
            province,
            city,
            district,
            street,
            number,
            totalAreaVolume,
            availableAreaVolume,
            slug: slugify(name),
        });

        res.status(201).send({
            success: true,
            message: 'create warehouse successfully',
            warehouse,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating',
        });
    }
};
export const getWareHousesController = async (req, res) => {
  try {
      const warehouse = await Warehouse.findAll({
          order: [['createdAt', 'DESC']],
      });
      res.status(200).send({
          success: true,
          counTotal: warehouse.length,
          message: 'all warehouse',
          warehouse,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error in getting warehouse',
          error: error.message,
      });
  }
};

//get single warehouse
export const getSingleWareHouse = async (req, res) => {
    try{
        const warehouse = await Warehouse.findOne({
            where: {slug: req.params.slug},
        });

        res.status(200).send({
            success:true,
            warehouse
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error when getting single warehouse",
            error: error.message,
        })
    }
};
export const updateWareHouseController = async (req, res) => {
    try {
        const { name, province, city, district, street, number, totalAreaVolume } = req.fields;
  
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'name is required' });
            case !province:
                return res.status(500).send({ error: 'province is required' });
            case !city:
                return res.status(500).send({ error: 'city is required' });
            case !district:
                return res.status(500).send({ error: 'district is required' });
            case !street:
                return res.status(500).send({ error: 'street is required' });
            case !number:
                return res.status(500).send({ error: 'number is required' });
            case !totalAreaVolume:
                return res.status(500).send({ error: 'Area is required' });
        }
  
        // Find the warehouse record by primary key
        const { slug } = req.params;

        const warehouse = await Warehouse.findOne({ where: { slug } });
        
        if (!warehouse) {
            return res.status(404).send({
                success: false,
                message: 'Warehouse not found',
            });
        }
  
        // Update the warehouse record
        await warehouse.update({
            name,
            province,
            city,
            district,
            street,
            number,
            totalAreaVolume,
            slug: slugify(name),
        });
        console.log(warehouse)
        res.status(201).send({
            success: true,
            message: 'update warehouse successfully',
            warehouse: warehouse,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating',
        });
    }
  };

  export const deleteWarehouseController = async (req, res) => {
    try {
      const warehouseName = req.params.name;
  
      const warehouse = await Warehouse.findOne({ where: { name: warehouseName } });
  
      if (!warehouse) {
        console.log(warehouse)
        return res.status(404).send({
          success: false,
          message: 'Warehouse not found',
        });
      }
  
      const productsCount = await Product.count({ where: { warehouse: warehouse.name } });
  
      if (productsCount !== 0) {
        return res.status(400).send({
          success: false,
          message: 'Cannot delete the warehouse because it contains products',
        });
      }
  
      await warehouse.destroy();
  
      res.status(200).send({
        success: true,
        message: 'Warehouse Deleted successfully',
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error while deleting warehouse',
        error,
      });
    }
  };
  

