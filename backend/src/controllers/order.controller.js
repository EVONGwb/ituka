import { Order } from '../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    // Exclude 'solicitud_recibida' if not explicitly asked, or handle logic in frontend
    // For now, return what is asked.
    const orders = await Order.find(query).populate('user', 'name email').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check authorization
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    // Assuming req.user is populated by auth middleware
    const order = new Order({
      user: req.user._id, // Ensure auth middleware populates this
      items,
      total,
      status: 'solicitud_recibida'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Order.find({ status: 'solicitud_recibida' }).populate('user', 'name email').populate('items.product');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
