import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`Usuario ${socket.id} se unió al chat ${chatId}`);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado!');
  }
  return io;
};
