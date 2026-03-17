import mongoose from 'mongoose';

export const SYSTEM_SETTINGS_KEY = 'global';

export const DEFAULT_SYSTEM_SETTINGS = {
  requestsAutoAccept: false,
  ordersRequireConfirmation: true,
  notificationsEnabled: true,
  deliveryMethodsEnabled: ['envio', 'recogida'],
  paymentMethodsEnabled: ['efectivo', 'transferencia', 'tarjeta'],
  customerAutoMessages: {
    orderCreated: 'Hemos recibido tu solicitud. Te contactaremos pronto.',
    orderConfirmed: 'Tu pedido fue confirmado. Gracias por tu compra.',
    orderShipped: 'Tu pedido está en camino.'
  }
};

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, immutable: true, default: SYSTEM_SETTINGS_KEY },
    requestsAutoAccept: { type: Boolean, default: DEFAULT_SYSTEM_SETTINGS.requestsAutoAccept },
    ordersRequireConfirmation: { type: Boolean, default: DEFAULT_SYSTEM_SETTINGS.ordersRequireConfirmation },
    notificationsEnabled: { type: Boolean, default: DEFAULT_SYSTEM_SETTINGS.notificationsEnabled },
    deliveryMethodsEnabled: {
      type: [String],
      enum: ['envio', 'recogida'],
      default: DEFAULT_SYSTEM_SETTINGS.deliveryMethodsEnabled
    },
    paymentMethodsEnabled: {
      type: [String],
      enum: ['efectivo', 'transferencia', 'tarjeta'],
      default: DEFAULT_SYSTEM_SETTINGS.paymentMethodsEnabled
    },
    customerAutoMessages: {
      orderCreated: { type: String, default: DEFAULT_SYSTEM_SETTINGS.customerAutoMessages.orderCreated },
      orderConfirmed: { type: String, default: DEFAULT_SYSTEM_SETTINGS.customerAutoMessages.orderConfirmed },
      orderShipped: { type: String, default: DEFAULT_SYSTEM_SETTINGS.customerAutoMessages.orderShipped }
    }
  },
  { timestamps: true }
);

export const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
