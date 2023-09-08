import { DataTypes } from 'sequelize';

const orderModel = (sequelize) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Not Process',
      allowNull: false,
      validate: {
        isIn: [['Not Process', 'Processing', 'Shipped', 'delivered', 'cancel']],
      },
    },
  }, {
    timestamps: true,
  });

  // Define the association with the Product and User models if needed
  // Example:
  // Order.belongsTo(User, { foreignKey: 'buyerId' });

  return Order;
};

export default orderModel;