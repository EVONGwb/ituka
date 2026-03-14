import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { getIO } from '../sockets/socket.js';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';

const normalizeSenderRole = (role) => {
  if (role === 'admin' || role === 'support') return role;
  if (role === 'customer') return 'user';
  return 'user';
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getUserId = (req) => (req.user?.id || req.user?._id || '').toString();

const hasChatAccess = (chat, userId, role) => {
  if (role === 'admin') return true;
  const participants = chat?.participants || [];
  return participants.some((p) => (p?._id?.toString?.() || p?.toString?.() || String(p)) === userId);
};

// Crear o obtener chat existente
export const getOrCreateChat = async (req, res) => {
  try {
    let { requestId, targetUserId } = req.body; // requestId (Order ID) o targetUserId (admin)
    const userId = getUserId(req);
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ message: 'Acceso no autorizado' });

    if (!requestId) {
      if (role !== 'admin' || !targetUserId) {
        return res.status(400).json({ message: 'requestId es requerido' });
      }

      const latestOrder = await Order.findOne({ user: targetUserId }).sort({ createdAt: -1 }).select('_id');
      requestId = latestOrder ? latestOrder._id.toString() : `support-${targetUserId}`;
    } else if (role !== 'admin') {
      if (requestId === 'support-general') {
        requestId = `support-${userId}`;
      } else if (isValidObjectId(requestId)) {
        const order = await Order.findById(requestId).select('user');
        if (!order || order.user.toString() !== userId) {
          return res.status(403).json({ message: 'Acceso denegado' });
        }
      } else if (requestId !== `support-${userId}`) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
    }

    let chat = await Chat.findOne({ requestId }).populate('participants', 'name email');

    if (!chat) {
      let participants = [userId];
      if (role === 'admin') {
        if (targetUserId) participants.push(targetUserId);
        if (isValidObjectId(requestId)) {
          const order = await Order.findById(requestId).select('user');
          if (order?.user) participants.push(order.user.toString());
        }
      }

      participants = [...new Set(participants.map(String))];
      chat = await Chat.create({ requestId, participants });
    } else {
      if (!hasChatAccess(chat, userId, role)) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }

      if (role === 'admin') {
        const currentParticipants = (chat.participants || []).map((p) => p?._id?.toString?.() || p?.toString?.() || String(p));
        if (!currentParticipants.includes(userId)) {
          chat.participants.push(userId);
          await chat.save();
        }
      }
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminChatByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    const latestOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).select('_id');
    const requestId = latestOrder ? latestOrder._id.toString() : `support-${userId}`;

    let chat = await Chat.findOne({ requestId }).populate('participants', 'name email role');

    if (!chat) {
      chat = await Chat.create({
        requestId,
        participants: [...new Set([adminId, userId].map(String))]
      });
      chat = await Chat.findById(chat._id).populate('participants', 'name email role');
    } else {
      const currentParticipants = (chat.participants || []).map(p => p._id?.toString?.() || p.toString());
      const nextParticipants = [...new Set([...currentParticipants, adminId, userId].map(String))];
      if (nextParticipants.length !== currentParticipants.length) {
        chat.participants = nextParticipants;
        await chat.save();
      }
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const adminId = req.user.id?.toString();
    const chats = await Chat.find({})
      .sort({ updatedAt: -1 })
      .populate('participants', 'name email role')
      .populate('lastMessage');

    const requestIds = chats.map(c => c.requestId).filter(id => typeof id === 'string' && isValidObjectId(id));
    const uniqueRequestIds = [...new Set(requestIds)];
    const orders = uniqueRequestIds.length
      ? await Order.find({ _id: { $in: uniqueRequestIds } })
          .populate('user', 'name email')
          .populate('items.product', 'name')
          .select('status total createdAt user items')
      : [];

    const orderById = new Map(orders.map(o => [o._id.toString(), o]));

    const conversations = chats.map(chat => {
      const order = orderById.get(chat.requestId);
      const participants = chat.participants || [];
      const otherParticipant =
        participants.find(p => p._id?.toString?.() !== adminId && p.role !== 'admin') ||
        participants.find(p => p._id?.toString?.() !== adminId) ||
        participants[0];

      const user = order?.user || otherParticipant;

      const productName = order?.items?.[0]?.product?.name || null;
      const requestSummary = order
        ? {
            id: order._id.toString(),
            status: order.status,
            total: order.total,
            productName
          }
        : null;

      return {
        chatId: chat._id.toString(),
        requestId: chat.requestId,
        user: user
          ? {
              _id: user._id?.toString?.() || user._id,
              name: user.name,
              email: user.email
            }
          : null,
        unreadCount: chat.unreadCount || 0,
        lastMessage: chat.lastMessage
          ? {
              content: chat.lastMessage.content,
              createdAt: chat.lastMessage.createdAt
            }
          : null,
        requestSummary
      };
    }).filter(c => c.user?._id);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = getUserId(req);
    const role = req.user?.role;
    if (!isValidObjectId(chatId)) return res.status(400).json({ message: 'chatId inválido' });

    const chat = await Chat.findById(chatId).select('participants');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });
    if (!hasChatAccess(chat, userId, role)) return res.status(403).json({ message: 'Acceso denegado' });

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType, imageUrl } = req.body;
    const senderId = getUserId(req);
    const senderRole = normalizeSenderRole(req.user.role);
    if (!senderId) return res.status(401).json({ message: 'Acceso no autorizado' });
    if (!isValidObjectId(chatId)) return res.status(400).json({ message: 'chatId inválido' });
    if ((!content || !String(content).trim()) && !imageUrl) return res.status(400).json({ message: 'Mensaje vacío' });

    const chat = await Chat.findById(chatId).select('participants');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });
    if (!hasChatAccess(chat, senderId, req.user?.role)) return res.status(403).json({ message: 'Acceso denegado' });

    const newMessage = await Message.create({
      chatId,
      senderId,
      senderRole,
      messageType,
      content,
      imageUrl
    });

    const update = {
      lastMessage: newMessage._id,
      updatedAt: Date.now()
    };
    if (senderRole === 'user') update.$inc = { unreadCount: 1 };
    await Chat.findByIdAndUpdate(chatId, update);

    // Emitir mensaje via Socket.io
    const io = getIO();
    io.to(chatId).emit('receive_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = getUserId(req);
    const role = req.user?.role;
    if (!isValidObjectId(chatId)) return res.status(400).json({ message: 'chatId inválido' });

    const chat = await Chat.findById(chatId).select('participants');
    if (!chat) return res.status(404).json({ message: 'Chat no encontrado' });
    if (!hasChatAccess(chat, userId, role)) return res.status(403).json({ message: 'Acceso denegado' });

    await Chat.findByIdAndUpdate(chatId, { unreadCount: 0 });
    res.status(200).json({ message: 'Chat marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Devolver la URL relativa para guardar en la base de datos
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
};
