import { User } from '../models/User.js';
import { Order } from '../models/Order.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').lean();
    
    // Enriquecer con datos de pedidos
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ user: user._id }).select('status createdAt total');
      
      const ordersCount = orders.filter(o => o.status !== 'solicitud_recibida' && o.status !== 'cancelado').length;
      const requestsCount = orders.filter(o => o.status === 'solicitud_recibida').length;
      
      // Última actividad: último login (si tuviéramos) o último pedido/mensaje/creación
      // Usaremos último pedido o fecha de creación como fallback
      const lastOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const lastActivity = lastOrder ? lastOrder.createdAt : user.updatedAt;

      return {
        ...user,
        stats: {
          ordersCount,
          requestsCount,
          totalSpent: orders.reduce((acc, curr) => acc + (curr.status === 'pagado' || curr.status === 'entregado' ? curr.total : 0), 0),
          lastActivity
        }
      };
    }));

    res.json(enrichedUsers);
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
