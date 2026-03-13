import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  requestId: { type: String, required: true }, // ID de la solicitud vinculada (e.g., Order ID o Support Ticket ID)
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', chatSchema);
