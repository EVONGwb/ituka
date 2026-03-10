import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde el archivo .env en la raíz del backend
// Intenta cargar desde backend/.env o ./env dependiendo de donde se ejecute
const envPath = process.cwd().endsWith('backend') ? '.env' : 'backend/.env';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

export const env = {
  PORT: process.env.PORT || 5050,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ituka',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  JWT_SECRET: process.env.JWT_SECRET || 'secret'
};
