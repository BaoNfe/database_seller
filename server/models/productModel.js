import { DataTypes } from 'sequelize';
import CategoryModel from './categoryModel.js';
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
    photo: {
      type: DataTypes.BLOB('long'),
      allowNull: true, 
    },
  });
  const Category = CategoryModel(sequelize);

  Product.associate = (models) => {
    Product.belongsTo(Category, {
      foreignKey: 'category_id',
      onDelete: 'CASCADE',
    });
  };

  return Product;
};

export default ProductModel;