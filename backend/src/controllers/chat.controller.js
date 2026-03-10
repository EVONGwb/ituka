import { Message } from '../models/Message.js';

export const getMessages = async (req, res) => {
  res.json([{ id: 1, content: 'Hola, tengo una duda sobre un producto', sender: 'Client' }]);
};

export const sendMessage = async (req, res) => {
  res.json({ message: 'Mensaje enviado' });
};
