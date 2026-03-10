import { Order } from '../models/Order.js';

export const getOrders = async (req, res) => {
  res.json([{ id: 101, total: 40.50, status: 'pending' }]);
};

export const createOrder = async (req, res) => {
  res.json({ message: 'Pedido creado', orderId: 102 });
};
