import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';
import { hasPermission } from '../config/permissions.js';
import { DEFAULT_SYSTEM_SETTINGS, SYSTEM_SETTINGS_KEY, SystemSettings } from '../models/SystemSettings.js';

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
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, note, paymentMethod, deliveryMethod } = req.body;
    const userId = (req.user?.id || req.user?._id || '').toString();
    if (!userId) return res.status(401).json({ message: 'Acceso no autorizado' });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items inválidos' });

    const systemSettings =
      (await SystemSettings.findOne({ key: SYSTEM_SETTINGS_KEY })
        .select('requestsAutoAccept ordersRequireConfirmation deliveryMethodsEnabled paymentMethodsEnabled')
        .lean()) || DEFAULT_SYSTEM_SETTINGS;

    const enabledPayment = Array.isArray(systemSettings.paymentMethodsEnabled) ? systemSettings.paymentMethodsEnabled : DEFAULT_SYSTEM_SETTINGS.paymentMethodsEnabled;
    const enabledDelivery = Array.isArray(systemSettings.deliveryMethodsEnabled) ? systemSettings.deliveryMethodsEnabled : DEFAULT_SYSTEM_SETTINGS.deliveryMethodsEnabled;

    if (paymentMethod && paymentMethod !== 'pendiente' && !enabledPayment.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Método de pago no permitido' });
    }
    if (deliveryMethod && deliveryMethod !== 'pendiente' && !enabledDelivery.includes(deliveryMethod)) {
      return res.status(400).json({ message: 'Método de entrega no permitido' });
    }

    const normalized = new Map();
    for (const item of items) {
      const productId = item?.product?.toString?.() || item?.product;
      const quantity = Number(item?.quantity);
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Producto inválido' });
      }
      if (!Number.isFinite(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Cantidad inválida' });
      }
      normalized.set(productId, (normalized.get(productId) || 0) + Math.floor(quantity));
    }

    const productIds = [...normalized.keys()];
    const products = await Product.find({ _id: { $in: productIds } }).select('_id price');
    if (products.length !== productIds.length) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const priceById = new Map(products.map((p) => [p._id.toString(), p.price]));
    const orderItems = productIds.map((productId) => ({
      product: productId,
      quantity: normalized.get(productId),
      price: priceById.get(productId)
    }));

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const initialStatus = systemSettings.ordersRequireConfirmation === false
      ? 'confirmado'
      : systemSettings.requestsAutoAccept
        ? 'en_conversacion'
        : 'solicitud_recibida';

    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      note,
      paymentMethod,
      deliveryMethod,
      status: initialStatus
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
    const role = req.user?.role;
    const canUpdateOrders = hasPermission(role, 'orders:update');
    const canUpdateRequests = hasPermission(role, 'requests:update');

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!canUpdateOrders && canUpdateRequests) {
      const allowed = new Set(['solicitud_recibida', 'en_conversacion']);
      if (!allowed.has(order.status) || !allowed.has(status)) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }
    }

    order.status = status;
    await order.save();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { userId, limit } = req.query;
    const query = userId ? { user: userId } : { status: 'solicitud_recibida' };

    let q = Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    const parsedLimit = Number(limit);
    if (userId && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      q = q.limit(parsedLimit);
    }

    const requests = await q;
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
