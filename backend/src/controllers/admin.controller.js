import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Message } from '../models/Message.js';

export const getStats = async (req, res) => {
  try {
    const newRequests = await Order.countDocuments({ status: 'solicitud_recibida' });
    
    // Active orders: any order that is not cancelled, completed, or a new request
    const activeOrders = await Order.countDocuments({ 
      status: { $nin: ['completed', 'cancelled', 'solicitud_recibida'] } 
    });
    
    const totalProducts = await Product.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    
    // Pending messages
    // Messages sent to this admin specifically
    const pendingMessages = await Message.countDocuments({ 
      read: false,
      receiver: req.user._id 
    });
    
    // Messages sent to general support (receiver: null)
    const generalPending = await Message.countDocuments({
        read: false,
        receiver: null
    });

    res.json({
      newRequests,
      activeOrders,
      totalProducts,
      totalClients,
      pendingMessages: pendingMessages + generalPending
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
