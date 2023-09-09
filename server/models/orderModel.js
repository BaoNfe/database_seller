import { DataTypes } from 'sequelize';

const orderModel = (sequelize) => {
  const Order = sequelize.define('Order', {

    status: {
      type: DataTypes.STRING,
      defaultValue: 'Not Process',
      allowNull: false,
      validate: {
        isIn: [['Not Process', 'accept', 'reject']],
      },
    },

  }, {
    timestamps: true,
  });

  // Order.associate = (models) => {
  //   Order.belongsToMany(models.Product, {
  //     through: 'OrderItem', 
  //     foreignKey: 'orderId',
  //   });
  // };

  return Order;
};

export default orderModel;
