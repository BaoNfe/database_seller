import { Op } from "sequelize";
import db from "../models/index.js";
import orderModel from "../models/orderModel.js";
import OrderItemModel from "../models/orderItemModel.js";
import slugify from "slugify";

const sequelize = db.sequelize;
const Order = orderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

export const OrderControl = async (req, res) => {
  try {
    const { cart } = req.body; // Assuming you send the cart data in the request body

    // Create a new order
    const newOrder = await Order.create({ status: 'Not Process' });

    // Create order items and associate them with the new order
    const orderItems = await Promise.all(
      cart.map(async (item) => {
        const orderItem = await OrderItem.create({
          name: item.name,
          description: item.description,
          price: item.price,
          amount: item.amount,
          volume: item.volume,
          orderId: newOrder.id, // Set the orderId to the newly created order's id
        });
        return orderItem;
      })
    );

    res.status(201).json({ message: 'Order placed successfully', order: newOrder, orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const OrderAccept = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (action === 'accept') {
      // Update order status to 'accept' and let the trigger handle inventory updates
      await order.update({ status: 'accept' });
    } else if (action === 'reject') {
      // Update order status to 'reject' and disassociate products from this order
      await order.update({ status: 'reject' });
    }

    return res.status(200).json({ success: true, message: `Order ${action}ed successfully` });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




