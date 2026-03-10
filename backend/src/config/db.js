import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout tras 5s en lugar de 30s
    });
    logger.info('📦 Conectado a MongoDB');
  } catch (error) {
    logger.warn('⚠️ No se pudo conectar a MongoDB. Iniciando en modo sin base de datos para desarrollo.');
    logger.error(`❌ Error detallado: ${error.message}`);
    // No salimos del proceso para permitir que el servidor arranque sin BD
    // process.exit(1); 
  }
};
