import { DataTypes } from 'sequelize';
import CategoryModel from './categoryModel.js';
import warehouseModel from './warehouseModel.js';

const ProductModel = (sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
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
    category_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warehouse: {
      type: DataTypes.STRING,
      defaultValue: 'null',
    },
    photo: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    // New field to store properties and their values as JSON
    properties: {
      type: DataTypes.STRING, // You can also use DataTypes.JSONB for binary JSON
      allowNull: true, // Set to true if some products may not have properties
    },
  });

  const Category = CategoryModel(sequelize);
  const Warehouse = warehouseModel(sequelize);

  Product.associate = (models) => {
    Product.belongsTo(Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE',
    });
    Product.belongsTo(Warehouse, {
      foreignKey: 'warehouse',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Order, {
      through: 'OrderItem',
      foreignKey: 'productId',
    });
  };

  return Product;
};

export default ProductModel;
