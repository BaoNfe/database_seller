import { DataTypes } from 'sequelize';

const CategoryModel = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    properties: {
      type: DataTypes.JSON, // Use DataTypes.JSON for storing JSON data
      allowNull: true,
    },
  });

  return Category;
};

export default CategoryModel;