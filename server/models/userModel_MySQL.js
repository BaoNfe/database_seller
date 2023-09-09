import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
      },
  });

  return User;
};

export default UserModel;