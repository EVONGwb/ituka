import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { Chat } from '../models/Chat.js';

export const getStats = async (req, res) => {
  try {
    // 1. Solicitudes nuevas (Prioridad 1)
    const newRequests = await Order.countDocuments({ status: 'solicitud_recibida' });
    
    // 2. Mensajes pendientes (Prioridad 2)
    // Usar el modelo Chat para contar chats con unreadCount > 0
    // Opcionalmente filtrar por chats donde el último mensaje no es del admin, pero unreadCount ya debería reflejar esto
    const pendingChats = await Chat.countDocuments({ unreadCount: { $gt: 0 } });
    
    // 3. Pedidos activos (Prioridad 3)
    // Cualquier pedido que esté en proceso (no solicitud inicial, ni completado/cancelado)
    const activeOrders = await Order.countDocuments({ 
      status: { 
        $in: ['en_conversacion', 'confirmado', 'pagado', 'en_preparacion', 'enviado', 'listo_para_recoger'] 
      } 
    });

    // 4. Clientes totales
    const totalClients = await User.countDocuments({ role: 'customer' });

    // 5. Total Productos
    const totalProducts = await Product.countDocuments();

    // 6. Ventas del mes (Pedidos pagados/entregados en los últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesThisMonth = await Order.aggregate([
      {
        $match: {
          status: { $in: ['pagado', 'enviado', 'entregado'] },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);

    // 7. Actividad Reciente (Expandida con clientes y productos)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .lean();

    const recentChats = await Chat.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('lastMessage')
      .populate('participants', 'name')
      .lean();

    const recentClients = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const recentProducts = await Product.find()
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean();

    const formattedActivity = [
      ...recentOrders.map(o => ({
        type: 'order',
        title: `Pedido #${o._id.toString().slice(-6).toUpperCase()}`,
        description: `${o.status.replace(/_/g, ' ')} - $${o.total}`,
        user: o.user?.name || 'Usuario',
        date: o.createdAt
      })),
      ...recentChats.filter(c => c.lastMessage).map(c => {
         const otherParticipant = c.participants.find(p => p._id.toString() !== req.user._id.toString());
         return {
            type: 'message',
            title: 'Nuevo Mensaje',
            description: c.lastMessage.content.substring(0, 30) + '...',
            user: otherParticipant?.name || 'Usuario',
            date: c.updatedAt
         };
      }),
      ...recentClients.map(u => ({
        type: 'client',
        title: 'Nuevo Cliente',
        description: 'Se ha registrado en la plataforma',
        user: u.name,
        date: u.createdAt
      })),
      ...recentProducts.map(p => ({
        type: 'product',
        title: 'Producto Actualizado',
        description: `${p.name} - $${p.price}`,
        user: 'Sistema',
        date: p.updatedAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10); // Mostrar hasta 10 actividades recientes

    // 8. Top Productos (Más vistos/vendidos) - Simulado con datos reales de pedidos
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { name: "$product.name", count: 1 } }
    ]);

    // 9. Gráfico Solicitudes (Últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const requestsByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 10. Últimas Solicitudes (Detalladas para el widget)
    const lastRequests = await Order.find({ status: 'solicitud_recibida' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('items.product', 'name')
      .lean();

    res.json({
      newRequests,
      pendingMessages: pendingChats,
      activeOrders,
      totalProducts,
      totalClients,
      salesMonth: salesThisMonth[0]?.total || 0,
      recentActivity: formattedActivity,
      topProducts,
      requestsByDay,
      lastRequests: lastRequests.map(r => ({
        id: r._id,
        user: r.user?.name || 'Usuario',
        product: r.items[0]?.product?.name || 'Producto',
        totalItems: r.items.length,
        status: r.status,
        date: r.createdAt
      }))
    });

  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
