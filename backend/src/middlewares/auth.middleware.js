import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (jwtError) {
        console.error('❌ Auth Middleware: JWT Verify Error:', jwtError.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  } catch (error) {
    console.error('❌ Auth Middleware: General Error:', error);
    return res.status(500).json({ message: 'Error interno de autenticación.' });
  }
};

export const protect = verifyToken;
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
};
