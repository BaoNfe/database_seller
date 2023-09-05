import warehouseModel from '../models/warehouseModel.js';
import db from "../models/index.js";
import { Op } from "sequelize";
import slugify from "slugify"; // Assuming the Sequelize model is named Warehouse
import dotenv from 'dotenv'

const sequelize = db.sequelize;
const Warehouse = warehouseModel(sequelize);
dotenv.config();
export const createWareHouseController = async (req, res) => {
    try {
        const {name, province, city, district, street, number, totalAreaVolume} = 
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
          limit: 12,
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

      const warehouse = await Warehouse.update(
          {
              name,
              province,
              city,
              district,
              street,
              number,
              totalAreaVolume,
              slug: slugify(name),
          },
          { where: { name: req.params.name }, returning: true }
      );

      res.status(201).send({
          success: true,
          message: 'update warehouse successfully',
          warehouses: warehouse[1][0],
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
      await Warehouse.destroy({ where: { name: req.params.name } });
      res.status(200).send({
          success: true,
          message: 'Product Deleted successfully',
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error while deleting product',
          error,
      });
  }
};

