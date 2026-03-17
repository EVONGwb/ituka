import { DEFAULT_SYSTEM_SETTINGS, SYSTEM_SETTINGS_KEY, SystemSettings } from '../models/SystemSettings.js';

function normalizeBool(value, fallback) {
  if (typeof value === 'boolean') return value;
  return fallback;
}

function normalizeStringArray(value, allowed, fallback) {
  if (!Array.isArray(value)) return fallback;
  const filtered = value.map(String).filter((v) => allowed.includes(v));
  return filtered.length ? [...new Set(filtered)] : [];
}

function normalizeMessages(value, fallback) {
  if (!value || typeof value !== 'object') return fallback;
  const out = { ...fallback };
  for (const k of Object.keys(out)) {
    const v = value[k];
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

export const getSystemSettings = async (req, res) => {
  try {
    let doc = await SystemSettings.findOne({ key: SYSTEM_SETTINGS_KEY }).lean();
    if (!doc) {
      const created = await SystemSettings.create({ key: SYSTEM_SETTINGS_KEY, ...DEFAULT_SYSTEM_SETTINGS });
      doc = created.toObject();
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ajustes del sistema' });
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const body = req.body || {};

    const patch = {
      requestsAutoAccept: normalizeBool(body.requestsAutoAccept, DEFAULT_SYSTEM_SETTINGS.requestsAutoAccept),
      ordersRequireConfirmation: normalizeBool(body.ordersRequireConfirmation, DEFAULT_SYSTEM_SETTINGS.ordersRequireConfirmation),
      notificationsEnabled: normalizeBool(body.notificationsEnabled, DEFAULT_SYSTEM_SETTINGS.notificationsEnabled),
      deliveryMethodsEnabled: normalizeStringArray(body.deliveryMethodsEnabled, ['envio', 'recogida'], DEFAULT_SYSTEM_SETTINGS.deliveryMethodsEnabled),
      paymentMethodsEnabled: normalizeStringArray(body.paymentMethodsEnabled, ['efectivo', 'transferencia', 'tarjeta'], DEFAULT_SYSTEM_SETTINGS.paymentMethodsEnabled),
      customerAutoMessages: normalizeMessages(body.customerAutoMessages, DEFAULT_SYSTEM_SETTINGS.customerAutoMessages)
    };

    const updated = await SystemSettings.findOneAndUpdate(
      { key: SYSTEM_SETTINGS_KEY },
      { $set: patch, $setOnInsert: { key: SYSTEM_SETTINGS_KEY } },
      { new: true, upsert: true }
    ).lean();

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar ajustes del sistema' });
  }
};
