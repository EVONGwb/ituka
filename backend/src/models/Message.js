import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['user', 'admin', 'support'], required: true },
  messageType: { type: String, enum: ['text', 'image', 'payment_proof'], default: 'text' },
  content: { type: String }, // Puede ser texto o vacío si es solo imagen
  imageUrl: { type: String }, // URL de la imagen si messageType es image o payment_proof
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
