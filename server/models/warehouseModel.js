import { DataTypes } from 'sequelize';

const warehouseModel = (sequelize) => {

  const Warehouse = sequelize.define('warehouse', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAreaVolume: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
  });
  return Warehouse;
};
export default warehouseModel;
