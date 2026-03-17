import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Chat } from '../models/Chat.js';

// POST /api/requests
export const createRequest = async (req, res) => {
  try {
    const { note } = req.body;
    
    // req.user is populated by auth middleware
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }
    
    let total = 0;
    const requestItems = cart.items.map(item => {
      const price = item.product.price;
      total += price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: price // Snapshot price
      };
    });
    
    const newOrder = await Order.create({
      user: req.user._id,
      items: requestItems,
      total,
      note: note || cart.note, // Use provided note or cart note
      status: 'solicitud_recibida'
    });

    const requestId = newOrder._id.toString();
    const existingChat = await Chat.findOne({ requestId }).select('_id');
    if (!existingChat) {
      await Chat.create({
        requestId,
        participants: [req.user._id]
      });
    }
    
    // Empty the cart
    cart.items = [];
    cart.note = '';
    await cart.save();
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la solicitud: ' + error.message });
  }
};

// GET /api/requests/my
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');
      
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener solicitudes' });
  }
};
