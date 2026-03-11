import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }); // Filter by client role usually
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
