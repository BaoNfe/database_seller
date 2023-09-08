import { DataTypes } from 'sequelize';

const warehouseModel = (sequelize) => {

  const Warehouse = sequelize.define('warehouse', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
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
    availableAreaVolume: {
      type: DataTypes.NUMERIC,
    },
  });
  Warehouse.prototype.isEmpty = async function () {
    const productsCount = await this.countProducts();
    return productsCount === 0;
  };
  return Warehouse;
};
export default warehouseModel;
