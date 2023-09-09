import { DataTypes } from 'sequelize';
import orderModel from './orderModel.js';
import db from "../models/index.js";

const sequelize = db.sequelize;
const Order = orderModel(sequelize)

const OrderItemModel = (sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {

orderId: {
    type: DataTypes.STRING,
    allowNull: false,
},
name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  volume: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  }
});
OrderItem.associate = (models) => {
    OrderItem.belongsTo(Order, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
    });
  };
return OrderItem
};

export default OrderItemModel