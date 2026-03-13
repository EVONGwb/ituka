import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";

import { env } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import { httpLogger } from "./src/middlewares/httpLogger.js";

import { connectDB } from "./src/config/db.js";
import healthRoutes from "./src/routes/health.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import ordersRoutes from "./src/routes/orders.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import requestsRoutes from "./src/routes/requests.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

import { notFound } from "./src/middlewares/notFound.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import http from 'http';
import path from 'path';
import { initSocket } from './src/sockets/socket.js';

const app = express();
const server = http.createServer(app);

if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Servir archivos estáticos (imágenes de chat)
const uploadDir = path.join(process.cwd(), 'public/uploads');
app.use('/uploads', express.static(uploadDir));

// Inicializar Socket.io
initSocket(server);

app.use(
  cors({
    origin: env.CORS_ORIGINS.length ? env.CORS_ORIGINS : true,
    credentials: true
  })
);
app.use(express.json()); app.use(helmet());

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Logs de cada request
app.use(httpLogger);

// Rutas
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

// 404 + errores
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB(env.MONGODB_URI);

  server.listen(env.PORT, () => {
    logger.info(`🚀 ITUKA Backend en http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });
}

start().catch((err) => {
  logger.error(err, "❌ Error al iniciar");
  process.exit(1);
});
