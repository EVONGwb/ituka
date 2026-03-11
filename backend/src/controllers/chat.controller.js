import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { getIO } from '../sockets/socket.js';

// Crear o obtener chat existente
export const getOrCreateChat = async (req, res) => {
  try {
    const { requestId } = req.body; // e.g., orderId
    const userId = req.user.id;

    let chat = await Chat.findOne({ requestId }).populate('participants', 'name email');

    if (!chat) {
      chat = await Chat.create({
        requestId,
        participants: [userId] // El admin/soporte se unirá después o ya está implícito
      });
    } else {
        // Asegurar que el usuario actual esté en los participantes si no lo estaba
        if (!chat.participants.some(p => p._id.toString() === userId.toString())) {
            chat.participants.push(userId);
            await chat.save();
        }
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType, imageUrl } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role || 'user'; // Asumimos 'user' si no hay rol definido

    const newMessage = await Message.create({
      chatId,
      senderId,
      senderRole,
      messageType,
      content,
      imageUrl
    });

    await Chat.findByIdAndUpdate(chatId, { 
        lastMessage: newMessage._id,
        updatedAt: Date.now() 
    });

    // Emitir mensaje via Socket.io
    const io = getIO();
    io.to(chatId).emit('receive_message', newMessage);

    res.status(201).json(newMessage);
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
