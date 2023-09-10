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
      type: DataTypes.UUID,
      allowNull: true,
    },
  });

  return Category;
};

export default CategoryModel;