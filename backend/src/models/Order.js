import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  note: { type: String },
  status: { 
    type: String, 
    enum: [
      'solicitud_recibida', 
      'en_conversacion', 
      'confirmado', 
      'pagado', 
      'en_preparacion', 
      'enviado', 
      'listo_para_recoger', 
      'entregado', 
      'cancelado'
    ], 
    default: 'solicitud_recibida' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
