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
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@ituka.com'
};
