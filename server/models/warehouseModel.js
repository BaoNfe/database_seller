import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql', // Specify your database dialect
  host: 'localhost',
  username: 'seller',
  password: 'seller',
  database: 'data_group',
});

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

export default Warehouse;
